---
Published: 'True'
SpecTag: DevNotes
desc: >-
  [!note] 动机
  随时可以呼出聊天界面，聊天中其中一个功能就是：记住我觉得需要做的事情。估计时长，每天选择其中一些推荐给我做。也可以把我说要做的事项分解成几个小事项。虽然最开始是这样的想法，结果做...
---
> [!note] 动机
> 随时可以呼出聊天界面，聊天中其中一个功能就是：记住我觉得需要做的事情。  
> 估计时长，每天选择其中一些推荐给我做。  
> 也可以把我说要做的事项分解成几个小事项。  
> 
> 虽然最开始是这样的想法，结果做着做着就往claw的方向去了！  
> 所以现在是希望用 Rust 实现，然后把内核的部分剥离出来进 HatoClaw，或者提供一定的参考。

![[d0c9fdf65d97c3938063b38a371ef938.png]]
也是正式开始做了，技术栈：[`Rust`](https://rust-lang.org/) + [`Slint`](https://slint.dev/) + [`Rig`](https://rig.rs/)

Slint 的文档也太烂了  
不过用了几天下来，感觉其功能也是足够的，只是文档建设太烂  
可能是因为 API 也经常变吧，干脆就不怎么写文档了

搜索用 SearXNG

今天是实现了一个 mac 上的保留无边框窗口的阴影和系统级resize功能
实现原理居然是不设置为无边框窗口（会变成直角而且不可拖动缩放）  
而设置为标题栏透明

过程中检索到的资料有：
- [tauri-plugin-mac-rounded-corners](https://github.com/cloudworxx/tauri-plugin-mac-rounded-corners/blob/main/mod.rs)
- [slint | Any way of creating real fullscreen overlay window on macOS? #11000](https://github.com/slint-ui/slint/discussions/11000)

其中第二个资料特别有用。虽然提问者说的是他用这些代码无效，但对我的需求其实反而是有用的。

最小原型开源在了这里：[Slint no-frame window demo for macOS](https://github.com/witheredAd/slint-macos-noframe-demo?tab=readme-ov-file)


# 2026-06-23

rig 的 bug 怎么这么多，ds 之前多轮 tool call 一直出问题，最后一轮的 text 会出现两次，今天从0.37.0 port 到 0.39.0 才修复。
![[Pasted image 20260623035754.png]]
添加了侧边栏、完善了session的保存与读取，rig port 到 0.39.0 解决多轮 toolcall 消息格式错乱问题，slint port 到 git main 来在 0.17.0 之前提前使用markdown styled-text（但实际上仍然很初级，不支持表格、公式、大标题、图片等，甚至加粗也不支持但是斜体、行内代码块支持，我是不太理解的，不都是字体变化吗）

后续预计添加功能：添加任务先添加DDL+任务标题（大概事项）（语音+LLM总结），变成一个卡片，双击卡片可将该任务分解；LLM可辅助给出非用户自身因素的时间的估计（如：制作Poster，在7-5上飞机前要到手，那么制作一般要几天？【辅助性可以提出一般Poster做多大？要多少钱？】是否要计算工作日，跳过假期？从而得到用户需要完成任务的时间节点，比如7-1要做完）；（待议：）仿照VibeOS的设计，让LLM根据已存储的该任务信息，自行设计展示任务的卡片排版，不同任务可以有不同的展示

skill啥的慢慢做吧，后面是希望，让这些插件衍生的功能里可以直接调用agent能力，这就实现了一个有记忆、可扩展能力的日程助手了，也是我为啥会转去做claw
