---
Published: 'True'
SpecTag: 小工具
desc: >-
  ![[Pasted image 20260212193640.png]]uv 创建的虚拟环境路径太长了写了个小工具，方便activate
  uv创建的环境可以在项目文件夹里 uv-activate .，...
---
![[Pasted image 20260212193640.png]]

uv 创建的虚拟环境路径太长了  
写了个小工具，方便activate uv创建的环境  
可以在项目文件夹里 `uv-activate .`，也可以在一个一堆项目的文件夹外面 `uv-activate <项目文件夹名>`

首先，在 `$PATH` 的文件夹里创建一个这样的脚本，命名为 `uv-activate`：
```bash
#!/bin/bash
# 本脚本结合 alias uv-activate='source uv-activate' 使用

# 检查是否有任何命令行参数被传递
if [ "$#" -gt 0 ]; then
    # 如果有参数，使用第一个参数作为路径前缀
    source "$1/.venv/bin/activate"
else
    # 如果没有参数，使用默认的相对路径
    source ".venv/bin/activate"
fi
```

然后，在 `~/.bashrc` 里，添加一行：
```bash
alias uv-activate='source uv-activate'
```

重载 shell，即可使用
