---
Published: 'True'
SpecTag: 搞机
desc: >-
  想用 easyuefi 从硬盘安装 ubuntu 的，结果把引导干爆了 记录一下很神奇的救砖经历先后尝试了diskgenius和大白菜的win
  pe，结果不仅没修好，还把efi分区给清掉了 然后发现微...
---


想用 easyuefi 从硬盘安装 ubuntu 的，结果把引导干爆了
记录一下很神奇的救砖经历

先后尝试了diskgenius和大白菜的win pe，结果不仅没修好，还把efi分区给清掉了
然后发现微软自己有一堆命令行工具，像是bootsect，bootrec，bcdedit都可以用来修复引导。很多装机工具可能就是调用他们的吧，只是之前不会用。

这台电脑上的uefi引导记录在0号扇区（100MB）里，也即 efi 分区，而不是和windows同在C盘里。efi分区（又称esp）格式化为fat32，里面有一个boot文件夹，其中存放efi文件，即为windows boot manager的引导文件。所以现在gpt格式（uefi）的硬盘，引导和系统分区都是分离的，引导不再留在C里了。

这次引导爆了的表现是，BIOS启动引导入WindowsBootManager，然后显示出WinLogo，底下win11转圈的地方变成点点圈，同时显示Please Wait，然后强行进入恢复模式，只有疑难解答和关机两个选项。疑难解答里只能启动命令行，其他选项没什么用。
_后来才知道命令行是最有用的……_

从大白菜winpe启动，尝试使用自带的一些引导修复工具进行修复，提示修复失败。使用easyuefi恢复引导备份，提示0x1690....数值无效。（内心：我草了啊我好不容易有备份一次的想法，你却让我输得这么彻底，恁不靠谱）

用dism++尝试修复引导，提示错误代码1005.（内心：你还写什么“如果您不知道这是什么意思，请点击确定”，那我知道反而不该点确定是吗）
然后回diskgenius检查了一下，发现efi分区变成空的了（内心：啊啊啊啊啊啊啊啊啊啊）

也不知道是不是bitlocker的原因。头一次见diskgenius提示所有分区都是bitlocker分区，还挺震撼的。

此时重启，发现disk0上面已经没有引导记录了，只剩u盘的引导可用。只能再进入大白菜pe。
然后开始发现bootrec这些工具，于是打开pe的cmd进行尝试，结果马上提示了没有bootrec.exe（内心：你大白菜故意的吧，把我电脑引导搞烂然后用你的pe装系统，装上一堆捆绑软件）

尝试bcdboot C:\windows /s K: /f UEFI，提示 bsfvc error: servicing bootfile failed code 0x57
_当然，在此之前需要给efi分区分配盘符_
并用diskgenius尝试了几次删除efi分区并重新建立，仍然提示此错误。
用diskpart尝试建立efi分区（create partition efi size=100），仍然提示此错误。
这里面还有一个好玩的事情，就是用diskpart对新创建的efi分区进行格式化时，提示无法格式化。
想用bootrec之类工具修复一下，然而大白菜pe里没有。
早知道在还能进恢复页面的时候用电脑上的命令提示符了。
感到找到症结了，遂不是很慌。

_然后下去和猫寻喝了库迪糖水。_

什么 winpe 都是浮云啊，直接上 win re
在好的电脑上开始菜单中输入 recovery，找到“恢复驱动器”，创建一个win re u盘，然后插入电脑。
电脑很神奇地又能启动了，打开了win11的恢复页面，当然还是只有疑难解答和关机。但是这次可以进入命令提示符。
输入bootrec /fixboot，提示拒绝访问。
用diskpart检查了一下，发现是efi分区给我删了之后还没建。遂建立一下。
```
> bootsect /nt60 sys
失败：在目标卷上找不到 xxx
> diskpart
DISKPART> list disk
0 xxxxxx 可用 117MB Gpt
1 Kingstonxxxx
DISKPART> sel disk 0
DISKPART> create partition efi size=100
操作成功完成。
DISKPART> list vol
xxxxxxxxxxxxxxxxxx
y xxxxxxxxxx 100MB
DISKPART> sel vol y
选定的卷 y。
DISKPART> assign letter=K:
DISKPART> format fs=FAT32
完成 0
完成 100%
操作成功完成。
DISKPART> exit
> bcdboot C:\Windows /s K: /f uefi
操作成功完成。
> bootrec /nt60 sys
将使用 BOOTMGR 兼容启动代码更新目标卷。
K: (\\?\Volume{xxxxxxxxxx})
	已成功更新 FAT32 文件系统启动代码。
已在所有目标卷上成功更新启动代码。
> bootrec /fixmbr
> bootrec /fixboot
> bootrec /rebuildbcd
> bcdedit /enum
xxxxxx
xxx Windows Boot Manager
xxxxxxxx
```
修复完成。重启进入系统。搞定！
