---
Published: 'True'
SpecTag: 论文阅读
desc: >-
  $pi_0$ (π0: A Vision-Language-Action Flow Model for General Robot
  Control)Intuitively, training only...
---

# $pi_0$ (π0: A Vision-Language-Action Flow Model for  General Robot Control)

> Intuitively, training only on high-quality data does not teach the model how to recover from mistakes, since mistakes are rarely seen in such data. Training on only lower-quality pretraining data does not teach the model to act efficiently and robustly.

直观上，仅在高质量数据上进行训练并不能教会模型如何从错误中恢复，因为错误在这类数据中很少见。仅在较低质量的预训练数据上进行训练并不能使模型高效、鲁棒地发挥作用。


### 看点
VLM、流匹配（Flow Matching，Diffusion 变种）；通用 VLA 的大规模预训练+任务相关微调。
VLM骨干+小模型动作专家
训练数据分布（文中称为 _recipe_）

Diffusion 用于输出 Action 的连续分布（？）








World Model emu3.5 V-JEPA2

关于具身智能领域的两座大山 目前在具身领域，最火的... http://xhslink.com/o/7cJjzpoDI4c 
复制后打开【小红书】查看笔记！





## Affordance Prediction 功能区域预测

> Affordances refer to potential actions that objects or environments enable for an observer, based on their properties. \[GEAL\]

关于 Affordance 这个词暂时还没有找到合适的中文翻译。这个任务的目标是，根据给出的问题（如果需要做某事，最适合使用该物品的什么部位？）以及一个物品的视觉输入（2D/3D），标注出该物品的功能性位置。


![[Pasted image 20251204160630.png]]


Phisical Intelligence 的 Pi 系列工作其实都挺不错的，后面打算先按照他们的这个顺序看一看。

数据集：**组成？**.有网络视频，何时引入？哪一部分是机械臂视频？来源全部现实吗？人类驾驶的？可不可以是模拟仿真数据？纯web视频的话，机械臂的马达角度怎么获取？还是web视频只用来train VLM?视频有没有特定条件来选取？

# $pi_0-"FAST"$ 

自回归型（Auto-regressive）的VLA，PI 系列的“自回归”，是用来和 Flow Matching（Diffusion）相对比的。在 $pi_0$ 中，模型采用一个 Action Expert，是一个 Flow Matching 模型，将 Action 表示为一个连续空间的 Token（==**How？**== **==Why？==**）. 而 FAST 提出一种能够以类似 Language Token 的方式表示 Action 的方法，从而获得了超快的训练速度（**==Why？==**）

缺陷：虽然训练更快了（5x 速度于$pi_0$），但推理更慢了，对高频任务不适用。  
可以从展示视频中看出，FAST 在机器人上明显更卡顿了。
# $pi_0.5$ 


# $pi_0.5$ with Knowledge Insulation（知识隔离）

pi0fast：慢，但无VLM知识破坏问题，
PioI快（推理）．但有儿心知识破问
# $pi_(0.6^*)$ 


[[Paper Review] Pi0, Pi0.5, Pi0-FAST - Tracing the Path of Physical Intelligence (PI)](https://bequiet-log.vercel.app/pi-review)

