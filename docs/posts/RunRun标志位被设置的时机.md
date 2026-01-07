---
title: RunRun标志位被设置的时机
date: 2026-1-4
excerpt: 总结一下进程调度过程中，RunRun标志位被设置的时机
---

# RunRun标志位被设置的时机

## 总结的必要性
由于进程从核心态返会用户态前，如果RunRun>0则会被抢占调度下台，所以判断什么时候RunRun被设置是很重要的

## RunRun在SetPri被设置
```cpp
void Process::SetPri()
{
    int priority;
    ProcessManager& procMgr = Kernek::Instance().GetProcessManager();
    priority=this->p_cpu/16;
    prioruty+=ProcessManager::PUSER+this->p_nice;
    if(priority>255){
        priority=255;
    }

    if (priority>procMgr.CurPri){
        procMgr.RunRun++;
    }
    this->p_pri=priority;
}
```

## 什么时候调用SetPri呢？
既然RunRun在SetPri被设置，那么我们只需要弄清什么时候需要调用`SetPri`(重算优先级)就可以了。

1. 整数秒时，会重算现运行进程的优先级。一旦算后优先数大于当前优先数，也就是算后优先级下降，表示当前进程没有那么适合占用cpu了，会导致RunRun++，在返回用户态前被抢占。



2. 整数秒时，内核会重新计算所有用户态就绪的进程的优先级。这个相对来说没有第一点那么容易理解，对其他进程满足算后优先数>当前进程当前优先数，就会RunRun++，这是主要由于一个时间片轮转的问题，保证1秒计时到会换一个进程占用cpu。

3. 系统调用末尾，trap会重算优先级。这里的主要目的是进程做完IO并完成核心态的任务，会将优先数从小于100算到大于100，会抹去进程曾睡眠的痕迹，并且很大概率会导致RunRun++，也是为了做完核心态任务的进程要下台把cpu让给别的进程


## RunRun在SetRun被设置
若唤起进程的优先级高于现运行进程，则设置RunRun