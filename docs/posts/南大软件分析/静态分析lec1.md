---
title: 南大软件分析第一讲
date: 2026-01-04
tags:
  - analysis
  - study
excerpt: This is my first post on this new VitePress blog.
---

## 静态分析与PL的关系
静态分析属于PL的应用领域很重要的一的分支

## 为什么我们需要静态分析
+ program reliability:空指针、内存泄漏
+ program security:私有数据泄露，注入攻击
+ compiler optimization:dead code elimination,code motion
+ program understanding:IDE call hierachy,type indication

## 静态分析简介
在运行这个程序之前就能了解这个程序的一些性质。

### Rice's Theorem 
"Any non-trivial property of the behavior of programs is a r.e. language is undecidable"
比较复杂的、有意思的性质都是non-trivial的（比如是否有空指针，是否有内存泄露等等）
正常的一个现代程序，动态运行时有用的性质，不存在一个方法能完全决定
Perfect static analysis是不存在的
perfect:sound and complete

我们关注useful static analysis:
compromise soundness:漏报
compromise completeness:误报
尽可能sound，因为保证了全面性