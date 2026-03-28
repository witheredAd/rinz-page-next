---
Published: 'True'
SpecTag: DevNotes
desc: >-
  [!动机]
  随时可以呼出聊天界面，聊天中其中一个功能就是：记住我觉得需要做的事情。估计时长，每天选择其中一些推荐给我做。也可以把我说要做的事项分解成几个小事项。虽然最开始是这样的想法，结果做着做着就往...
---
> [!动机]
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

