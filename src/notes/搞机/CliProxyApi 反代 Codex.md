---
Published: 'True'
SpecTag: 搞机
desc: >-
  如果遇到 Unsupported param: "response_format"在 CPA 的 config.yaml 中添加：payload:
  override: - models: - name...
---

如果遇到 `Unsupported param: "response_format"`

在 CPA 的 `config.yaml` 中添加：
```yaml
payload:
  override:
    - models:
        - name: "gpt-*"
          protocol: "codex"
      params:
        "reasoning.effort": "xhigh"
  filter:
    - models:
        - name: "gpt-*"
      params:
        - "response_format"
```

参考：
https://linux.do/t/topic/1698581/50
