---
Published: 'True'
SpecTag: 搞机
desc: >-
  反向转发ssh -R 127.0.0.1:19800:127.0.0.1:7890 <host>安装 uv（首先需设置 http_proxy 和
  https_proxy）curl -LsSf http...
---
反向转发
```bash
ssh -R 127.0.0.1:19800:127.0.0.1:7890 <host>
```

安装 uv（首先需设置 http_proxy 和 https_proxy）
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

设置 uv 镜像
在 `~/.config/uv/uv.toml` 设置
```toml
[[index]]
url = "https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple/"
default = true
```

> [!info]
> 最近几年 TUNA 常常断流，可以使用北外节点 `https://mirrors.bfsu.edu.cn/pypi/web/simple`
> 
> 参考：[nix-channels/store 下载较大文件时有大概率断流 #809 | tuna/issues](https://github.com/tuna/issues/issues/809)

初始化 uv 项目
```bash
uv init
uv python pin 3.11
```

检查 `pyproject.toml` 的 `required-python` 是否 `>=3.11`

（消除 http_proxy 和 https_proxy）
```bash
unset http_proxy https_proxy
```

添加针对 cuda128 的 torch > 2.7
```bash
uv add "torch>2.7" torchvision torchaudio --index https://download.pytorch.org/whl/cu128
```

如果后续添加依赖发生版本问题，通常是 torch 的 index 被选为了默认的解析源，而 torch 的 index 里很多包比较老，容易出现 resolve 不动的情况。这是需要切换 torch 的 index 为仅对 torch 生效：

```toml

[tool.uv.sources]
torch = { index = "pytorch-cu128" }
torchaudio = { index = "pytorch-cu128" }
torchvision = { index = "pytorch-cu128" }

[[tool.uv.index]]
name = "pytorch-cu128"
url = "https://download.pytorch.org/whl/cu128"
explicit = true

[[tool.uv.index]]
url = "https://mirrors.bfsu.edu.cn/pypi/web/simple"
default = true
```


flash-attn wheel
`https://github.com/mjun0812/flash-attention-prebuild-wheels/releases/download/v0.9.4/flash_attn-2.8.3+cu128torch2.11-cp311-cp311-linux_x86_64.whl`


