---
Published: 'True'
SpecTag: 搞机
desc: >-
  最近14X的主板坏了，我以为是bios问题，就放电重置了bios，一顿操作后设置虽然复原了，（以及还在bios里恢复了出厂），但是仍然启动不了系统。体现为：任何系统无法引导，可以出引导界面（如grub
---

最近14X的主板坏了，我以为是bios问题，就放电重置了bios，一顿操作后设置虽然复原了，（以及还在bios里恢复了出厂），但是仍然启动不了系统。体现为：任何系统无法引导，可以出引导界面（如grub和windows的加载圈），但接下来就会卡住。
总之是去机械革命的店里修好了，修还得叮嘱他们不要乱动硬盘，前台接待还打算欺负我直接把我硬盘给格式化了（=\_=！）
工程师态度倒是不错，咪说“所以，他当不了接待”（
修好之后，grub的引导不识别了。按理说来，efi分区里的东西应该没有变。于是，我打算先用U盘系统进去看看文件。
使用ventoy启动了archlinux的安装介质。那个其实就是个小的arch linux，装机要用的工具，fdisk什么都有，就很方便。
启动之后，依照社区圣经（[链接](https://arch.icekylin.online/guide/rookie/basic-install)）的安装方法重新mount了根目录：
```bash
mount -t btrfs -o subvol=/@,compress=zstd /dev/nvme1n1p4 /mnt
```
然后，mount EFI目录。我的14X上，efi目录是mount在/efi的，这个可通过cat /etc/fstab得知。（查了一下和xk的聊天记录也得知，esp在/efi，grub的配置在/boot/grub，grub的efi在/efi/GRUB，GRUB是grub-install时可以指定的bootloader-id，grub-mkconfig负责写入UEFI）

```bash
mount /dev/nvme1n1p1 /mnt/boot
```
mount完之后，ls了一下/mnt/efi，发现grub的启动项文件还是在的。但是在BIOS里却看不到。我才意识到，这个efi里的文件并不是BIOS每次都会扫描的，需要在BIOS里注册。
（具体注册原理还不知道）
于是重新执行了grub-install和grub-mkconfig：
```bash
arch-chroot /mnt
rm -rf /efi/EFI/GRUB
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id=GRUB
grub-mkconfig -o /boot/grub/grub.cfg 
```
这时候是找不到Windows的，但是没关系，grub-mkconfig已将grub写入UEFI配置项。
```bash
exit
umount -R /mnt
reboot
```
重启，进入bios，打开boot选项，GRUB已经出现。调整GRUB和Windows Boot Manager的优先级，优先GRUB，save&quit，进入linux。
进入linux之后，再sudo执行一次grub-mkconfig就能找到windows了。
```bash
sudo grub-mkconfig -o /boot/grub/grub.cfg 
```
