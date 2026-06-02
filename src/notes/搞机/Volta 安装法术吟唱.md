---
Published: 'True'
SpecTag: 搞机
desc: >-
  安装 volta （可能需要代理）curl https://get.volta.sh | bash exec bashvolta 设置 node 镜像
  vim ~/.volta/hooks.json{...
---

安装 volta （可能需要代理）
```bash
curl https://get.volta.sh | bash
exec bash
```

volta 设置 node 镜像
`vim ~/.volta/hooks.json`
```json
{
    "node": {
        "index": {
            "template": "https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/index.json"
        },
        "distro": {
            "template": "https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v{{version}}/{{filename}}"
        }
    }
}
```

安装 node（自动同时安装 npm）
```bash
volta install node
```

设置 npm 镜像
```bash
npm config set registry https://registry.npmmirror.com
```

设置启用 volta 管理 PNPM
`vim ~/.bashrc`
```bash
# 添加
export VOLTA_FEATURE_PNPM=1
```

重新加载环境变量
```bash
exec bash
volta install pnpm
```

（然后安装 claude < 2.1.149）
```bash
npm install -g @anthropic-ai/claude
```
设置 claude 
```json
{
	"env": {
		"CLAUDE_CODE_ATTRIBUTION_HEADER": "false"
	},
	"hasCompletedOnboarding": true
}
```
