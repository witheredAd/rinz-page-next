---
Published: 'True'
SpecTag: 搞机
desc: >-
  直接编辑 ~/.codex/config.toml 添加：model = "ZhipuAI/GLM-4.6" model_provider =
  "modelscope" [model_provider...
---


直接编辑 `~/.codex/config.toml`
添加：
```text
model = "ZhipuAI/GLM-4.6"
model_provider = "modelscope"
[model_providers.modelscope]
name = "Modelscope"
base_url = "https://api-inference.modelscope.cn/v1"
env_key = "MODELSCOPE_API_KEY"
```
`env_key` 是环境变量名，可放在 `.bashrc`，暂不知是否有直接输入的办法

参考：
https://zhuanlan.zhihu.com/p/1965707567213807510
