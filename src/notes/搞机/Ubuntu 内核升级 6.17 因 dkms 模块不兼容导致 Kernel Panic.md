---
Published: 'True'
SpecTag: 搞机
desc: >-
  系统自动将 Ubuntu 内核升级到 6.17 后，重启无法进入系统，通过 grub 后亮紫屏，提示：Kernel panic! VFS: Unable
  to mount rootfs on unkn...
---

系统自动将 Ubuntu 内核升级到 `6.17` 后，重启无法进入系统，通过 grub 后亮紫屏，提示：

```
Kernel panic!
VFS: Unable to mount rootfs on unknown-block(0,0)
You need to reboot your machine.
```

~~原来 Linux 也有蓝屏~~

遇到这种情况，首先是通过重启进入 GRUB 的 Advanced Menu，选择上一个正常工作的旧内核（本例中为 `6.14`）进入系统，以便进行排查和修复。

> [!Note]
> AI 创作提示：本文由我和 Gemini 共同完成，但所有步骤都经人工验证，并确实解决了我的问题。

## 排查过程

我最初猜测可能是引导问题，因为我鸡哥上就掉过两三次引导。  
根据[这个很老的网页]()，我猜测可能是更新过程中没有顺利生成 initrd.img。因此，我尝试手动执行 `update-initramfs`，但重启后问题依旧。

既然能够展示紫屏，至少 grub 应该已经顺利引导了系统。所以，应该是内核本身存在异常。

于是我尝试执行 `apt upgrade`：运行此命令后，系统直接提示有关 Linux 内核的几个软件包全都处于 dpkg postinstall 失败的状态。

为了修复损坏的包状态，我尝试重新安装内核软件包。  
然而，`apt install linux-generic-hwe-24.04` 提示已是最新；  
`apt install --reinstall linux-generic-hwe-24.04` 提示 `No file name for linux-generic-hwe-24.04:amd64`。

其实考虑到apt upgrade结束后是 dpkg postinstall 的失败，重新通过 apt 安装本来可能也没什么用。我又不敢卸载这个软件包后重新安装。因此，需要从更底层的配置上，也就是 dpkg，去找线索。

## 定位根本原因

既然 `apt upgrade` 明确指出了是 `dpkg postinstall` 阶段失败，下一步就是找出具体是哪个包、哪一行脚本卡住了配置过程。

运行以下命令可以尝试重新配置软件包：

```bash
sudo dpkg --configure -a
```

在这次命令的输出中，我观察到了 dpkg 具体的报错信息。

_(注：内核升级失败的原因因人而异，有时是 /boot 分区空间不足。运行这个命令查看具体报错是排查的核心。)_

在我的输出日志中，报错指向了 **DKMS 编译失败**，生成了一个crash文件在`/var/crash/v4l2xxxxx`（具体名字记不得了）. 输出大致上为：

```
Building initial module for  xxx
ERROR: Cannot create report: [Errno 17] File exists: '/var/crash/v4l2xxx.crash'
Error! Bad return status for module build on kernel: xxxx
```

打开这个crash文件，提示：在编译 `v4l2loopback-0.15.0` 这个模块时，`v4l2loopback.c:2904:9` 产生 `implicit-function-declaration` 错误，提示编译器找不到 `setup_timer` 函数。

> Linux 6.17 内核中移除了旧版的 `setup_timer` API。而系统中安装的 `v4l2loopback` 源码版本过旧，依然在调用这个已废弃的函数，导致 DKMS 模块编译失败。这个编译错误直接中断了新内核的 `dpkg postinstall` 流程，导致内核处于未完全配置的状态，进而引发了重启时的 Kernel Panic。

经过查询，该问题已经至少于 2026 年 1 月被多个用户确认，该软件包仓库内也已经合并了针对 Linux 6.18 内核的更新，但 Ubuntu 并没有更新软件源。  
[linux-surface/linux-surface #1949 | Github](https://github.com/linux-surface/linux-surface/issues/1949)  
辣鸡 Ubuntu（~~这一行是 AI 写的~~）

## 修复步骤

好在该模块只是一个虚拟摄像头模块，我平时并不会用到它。既然它的不兼容阻碍了内核配置，解决方式就是移除该模块。

**1. 卸载冲突模块**

```bash
sudo apt purge v4l2loopback-dkms
```

**2. 恢复内核配置**

在执行完 `purge` 命令卸载掉冲突包后，`dpkg` 自动接管并完成了之前被中断的内核包配置工作。为了确认状态正常，再次执行：

```bash
sudo dpkg --configure -a
```

此时系统提示没有任何需要配置的包，表明 6.17 内核已经成功配置完毕。

> [!warning] 一些碎碎念
> `apt purge` 之后，居然提示我 `dkms` 是自动安装的并且不再需要了。这 apt autoremove 真的能信吗？

**3. 重启与恢复环境**

重启电脑，顺利通过 6.17 内核进入系统。

在处理包依赖重置后，Ubuntu 自动启用了 gdm. 因为我不想它占用我的显存，所以进入系统后手动将其再次 disable.

