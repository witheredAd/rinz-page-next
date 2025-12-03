---
Published: 'True'
SpecTag: 搞机
desc: >-
  Github 本身是无法 fork 自己的仓库到自己的账号下的，会提示账号下已存在该仓库。 ![[Pasted image
  20251203024222.png]] 但是有时候就是想创建一份副本，比如...
---


Github 本身是无法 fork 自己的仓库到自己的账号下的，会提示账号下已存在该仓库。
![[Pasted image 20251203024222.png]]
但是有时候就是想创建一份副本，比如测试用途，又不想在本地 clone 完在 push 到新的。

这个时候可以使用 [GitHub Importer](https://docs.github.com/en/migrations/importing-source-code/using-github-importer/importing-a-repository-with-github-importer)，详细的介绍可以走链接看官方文档，这里介绍下使用其创建自己仓库的副本的流程：

> [!warning] 注意
> 采用本方法「fork」的仓库，与源仓库不具有真正意义上的 fork 关系，**无法发起 Pull Request**，关于这点还请知悉。此方法仅用于纯云端复制一份测试仓库。

1. 在任意的 GitHub 主站页面，在右上角 CoPilot 按钮边上有一个加号按钮。点开这个菜单，选择「Import repository」
	![[Pasted image 20251203025120.png]]
2. 在 url 处输入想要复制的 GitHub 仓库地址，在 username 处输入你可以访问该仓库的 Personal Access Token（一般是 Classic 模式的 Token，选中 repo 分类所有权限），在 password 处输入 `x-oauth-basic`（没错，就是这串文本）。
	![[Pasted image 20251203025400.png]]
3. 然后输入你想复制到的仓库名称和可见性，点击 Begin Import 即可。
