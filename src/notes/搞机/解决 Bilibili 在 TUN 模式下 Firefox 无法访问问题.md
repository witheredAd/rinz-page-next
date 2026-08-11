---
Published: 'True'
SpecTag: 搞机
desc: >-
  很神奇，最近 TUN 上网的时候，zen（firefox）总是打不开 bilibili 的 hdslb.com 的资源，导致页面缺少很多
  js、css，有时候直接就白屏无法使用。同时，zen 还会提示...
---
很神奇，最近 TUN 上网的时候，zen（firefox）总是打不开 bilibili 的 hdslb.com 的资源，导致页面缺少很多 js、css，有时候直接就白屏无法使用。

同时，zen 还会提示「网站正在请求检测局域网内的设备」，但无论允许还是拒绝，都不影响 hdslb.com 的文件无法从 bilibili 主站打开。

关闭 TUN，此问题消失；使用 safari 无此问题。但太不方便了，而且我就是想用 zen，遂检修。

F12 开发人员工具显示，对 hdslb.com 的请求全部触发 `NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED` 错误，根据此链接：[Hikvision 最近在 Mozilla Firefox v 1.5.2 上停止显示实时串流和回放 | Reddit](https://www.reddit.com/r/Hikvision/comments/1uw56no/hikvision_recently_stopped_showing_live_feed_and/?tl=zh-hant)， 可知这和 firefox 在 `>140, <=152` 的某个版本引入的一项安全措施 `network.luna.blocking`，可在 `about:config` 中关闭。按操作关闭后，TUN 下的 bilibili 恢复正常。

但还是很奇怪，如果和 firefox 有关，为什么关闭 TUN 之后没问题呢？或许和 TUN 的 DNS 假地址有关？猜测是 NS 解析到一个本地地址，再加上页面需要某种配置，激活了 firefox 的这项安全措施。
