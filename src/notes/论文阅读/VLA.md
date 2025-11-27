---
Published: 'True'
SpecTag: 论文阅读
desc: >-
  $pi_0$ (π0: A Vision-Language-Action Flow Model for General Robot
  Control)Intuitively, training only
---

# $pi_0$ (π0: A Vision-Language-Action Flow Model for  General Robot Control)

> Intuitively, training only on high-quality data does not teach the model how to recover from mistakes, since mistakes are rarely seen in such data. Training on only lower-quality pretraining data does not teach the model to act efficiently and robustly.

直观上，仅在高质量数据上进行训练并不能教会模型如何从错误中恢复，因为错误在这类数据中很少见。仅在较低质量的预训练数据上进行训练并不能使模型高效、鲁棒地发挥作用。


### 看点
VLM、流匹配（Flow Matching，Diffusion 变种）；通用 VLA 的大规模预训练+任务相关微调。
VLM骨干+小模型动作专家
训练数据分布（文中称为 _recipe_）

Diffusion 用于输出 Action 的连续分布（？）
