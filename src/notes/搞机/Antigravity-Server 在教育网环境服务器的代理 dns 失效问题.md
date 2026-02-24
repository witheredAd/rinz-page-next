---
Published: 'True'
SpecTag: 搞机
desc: >-
  Antigravity 连接到服务器上时，默认不走代理，我使用了 antissh 这个工具，这个工具使用 graftcp
  对antigravity-server 进行代理，但是检测连接google.c...
---

Antigravity 连接到服务器上时，默认不走代理，我使用了 `antissh` 这个工具，这个工具使用 graftcp 对antigravity-server 进行代理，但是检测连接`google.com`时，始终显示dest ip为`[2001::1]:443`。下文记录了我解决该问题的经过。

> [!Note]
> AI 创作提示：本文由我和 Gemini 共同完成，但所有步骤都经人工验证，并确实解决了我的问题。

# 记一次 graftcp 代理 Go 程序遭遇 2001::1 IPv6 黑洞的硬核排查与完美解决

## 背景与问题现象

在 Linux 远程服务器上开发时，我们经常需要让某些命令行工具走代理。最近在使用 `graftcp` 代理一个 Go 语言编写的程序时，遇到了一个诡异的问题：程序尝试连接 `google.com` 时，始终被解析到 `2001::1` 这个神秘的 IPv6 地址，最终导致连接超时。

查看 Clash 的日志，发现了案发现场的关键线索：

```
[TCP] 127.0.0.1:48380(graftcp-local, uid=1001) --> [2001::1]:443 match Match
```

日志显示，Clash 直接连接了 `[2001::1]`，这显然不是一个有效的 ip 地址。

## 抽丝剥茧：定位元凶

起初，我怀疑是 Clash 的 Fake-IP 分配出了问题，但通过终端直接运行 `ping6 google.com` 和 `nslookup`，发现系统默认的 DNS (`systemd-resolved` 监听的 `127.0.0.53`) 返回的是真实无污染的 IPv6 地址。

既然系统 DNS 没问题，为什么 Go 程序一放进 `graftcp` 里跑，就会拿到 `2001::1` 呢？结合代理工具的底层逻辑，真相浮出水面：

1. **`graftcp` 的盲区：** `graftcp` 的原理是通过 `ptrace` 劫持程序的 `connect()` 系统调用，也就是**它只劫持 TCP 流量，完全不管 UDP**。
2. **Go 程序的特性：** Go 是静态编译的，自带底层的 DNS 解析器，发起的是标准的 UDP DNS 请求。
3. **UDP 泄漏与 GFW 投毒：** Go 程序的 UDP DNS 请求直接穿透了 `graftcp`，漏到了公网（教育网或运营商 DNS）。当这个包含 `google.com` 的 AAAA（IPv6）请求经过 GFW 时，遭到了经典的 **DNS 战术抢答/污染**，GFW 塞回了一个废弃的保留地址：`2001::1`。
4. **Clash 成为背锅侠：** Go 程序拿着被污染的 `2001::1` 发起 TCP 连接。此时 `graftcp` 终于介入，把这段 TCP 请求强行塞给 Clash。但 Clash 的 Fake-IP 映射表里根本没有这个地址，只能把它当做普通公网 IP 处理，最终直连超时。

## 严苛的现实约束

明确了原因后，通常有几种解决办法，但我的环境有着严苛的限制条件：

- **不能用 Clash TUN 模式：** 这是远程服务器，开启全局虚拟网卡（TUN）一旦代理崩溃，立刻断网失联，风险极高。
- **不能用 proxychains-ng：** 它是基于 `LD_PRELOAD` 劫持动态链接库的，对静态编译的 Go 程序完全无效。
- **不能强绑系统全局 DNS：** 如果把 `/etc/resolv.conf` 彻底绑死在 Clash 上，万一 Clash 进程挂掉，服务器连基础的 `apt update` 都会瘫痪。

## 破局之道：无痛、防失联的终极架构

为了在不破坏系统稳定性的前提下解决污染，最终采用的方案是：**将 Clash 作为本地独立 DNS，同时利用 `systemd-resolved` 的 Fallback 机制实现无缝降级。**

### 第一步：赋予 Clash 绑定特权端口的能力

Linux 规定 1024 以下的端口（如 DNS 的 53 端口）必须 root 权限才能绑定。为了安全，我们不以 root 运行 Clash，而是利用 `setcap` 赋予二进制文件特定的网络特权：

```bash
# 为 Clash 赋予绑定特权端口的能力
sudo setcap 'cap_net_bind_service=+ep' /usr/local/bin/clash
```

### 第二步：配置 Clash DNS

修改 Clash 配置文件，让其监听一个本地独立的 IP（如 `127.0.0.153`）.

```yaml
dns:
  enable: true
  listen: 127.0.0.153:53     # 独立监听，避开系统服务冲突
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  nameserver:
    - 223.5.5.5              # 上游必须写死外部真实 DNS，防止循环解析
    - 119.29.29.29
  fallback:
    - 8.8.8.8
```

_重启 Clash 后，它将在 `127.0.0.153:53` 静静等待。_

这里可以使用 `sudo ss -tulpn | grep :53` 检查。

### 第三步：配置 systemd-resolved 实现安全 Fallback

修改系统的 `/etc/systemd/resolved.conf`，将首选 DNS 指向 Clash，并将可靠的公网 DNS 作为备胎。

```ini,toml
[Resolve]
DNS=127.0.0.153
FallbackDNS=223.5.5.5 114.114.114.114
```

重启 `systemd-resolved` 服务：`sudo systemctl restart systemd-resolved`。

这里可以使用 `resolvectl status` 查看配置状态。应该出现在 Global 项中：

```bash
$ resolvectl status
Global
           Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
    resolv.conf mode: stub
  Current DNS Server: 127.0.0.153
         DNS Servers: 127.0.0.153
Fallback DNS Servers: 223.5.5.5 114.114.114.114
```

## 完美结局

配置完成后：

1. Go 程序发起 DNS 请求时，首先发给首选 DNS（Clash）。
2. Clash 返回一个 `198.18.x.x` 的安全 Fake-IP。
3. `graftcp` 成功劫持这段安全的 TCP 流量，完美连通！

更重要的是，**这套方案兼顾了极高的安全性**：如果某天关掉了 Clash，`systemd-resolved` 连不上 `127.0.0.153`，会在毫秒级内自动无缝切换到 `223.5.5.5`，远程服务器绝不会因此失联断网。
