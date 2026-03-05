---
Published: 'True'
SpecTag: 搞机
desc: >-
  即便使用了 TUN + fake-ip，我有时仍然遇到 Git SSH 卡住的问题，这可能和服务提供商的防火墙有关。Github
  官方提供了解决方案：一些防火墙可能屏蔽了 22 端口。对此，你可以切换...
---
即便使用了 TUN + fake-ip，我有时仍然遇到 Git SSH 卡住的问题，这可能和服务提供商的防火墙有关。

Github 官方提供了[解决方案](https://docs.github.com/en/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)：一些防火墙可能屏蔽了 22 端口。对此，你可以切换到 Github 的 443 端口，只是注意域名要改成 `ssh.github.com`. （[参考](https://stackoverflow.com/questions/8750930/git-clone-hangs-forever-on-github)）

你可以像我一样这样修改 `~/.ssh/config`：
```ssh-config
Host github.com
    User git
    HostName ssh.github.com
    IdentityFile ******
    IdentitiesOnly yes
    Port 443
```

这样，就可以继续愉快地使用 Github 网页上复制的 SSH Clone 命令了。
