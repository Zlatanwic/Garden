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

1. 整数秒时，内核会重新计算所有用户态就绪的进程的优先级。这是很容易理解的，因为这正是保证各个进程的优先级有规律变化的基本操作，用户态就绪的进程p_cpu减小重算优先级会在>100的层级上优先数减小，优先级变大，从而更有可能上台


## RunRun在SetRun被设置