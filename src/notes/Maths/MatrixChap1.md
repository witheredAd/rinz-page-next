---
Published: "True"
SpecTag: Maths
---

```typst
#let project(
  title: [],
  doc
) = {
  set text(
    font: ("Linux Libertine", "Source Han Serif SC"),
    size: 12pt,
  )

  show "。":[. ]
  doc
} 
#show: project.with(
  title: [线性空间]
)


/ 封闭: 设非空的集合$V$，操作$f$，如果 $forall alpha, beta in V$，有 $f(alpha,beta) in V$，则称$V$对 $f$是封闭的。



/ 向量空间: 针对向量加法和向量数乘封闭的向量集合。

数乘应该是定义为一个*一元的*操作。

/ 线性空间: 
- 将向量空间中的实数扩展为一般的数（数域），
- 将向量空间中的集合元素（向量）扩展为一般的元素（非空集合），
- 将向量加法和数乘扩展为一般的加法和数乘。

/ 数域: 设$F$是非空数集，若$F$对加、减、乘、除（除数不为$0$）封闭，则称该数集$F$为一个数域。

$QQ, RR, CC$是数域，$NN, ZZ$不是

最小的数域是有理数域


/ 加群: 非空集合 $V$ 上定义一种代数运算，称之为加法，是的$forall alpha,beta in V$都有唯一元素 $alpha+beta$与之对应，且满足如下性质：
1. 交换律
2. 结合律
3. 存在零元素：$exists theta in V " " s.t." " forall alpha in V, alpha + theta = alpha$
4. 存在负元素：$forall alpha in V, exists "-"alpha " " s.t. " " alpha + ("-"alpha) = theta$

相应地，称$V$在加法运算下构成一个加群，记为$(V, +)$.


$(ZZ,+),(QQ,+),(RR,+),(CC,+)$构成加群。

$(QQ without {0},times),(RR without {0},times),(CC without {0}, times)$也构成加群（零元素为$1$）.

/ 线性空间: 设加群$(V,+)$，数域$F$，定义运算“数乘”：使得$forall lambda in F, alpha in V$，有$V$中唯一元素 $lambda alpha$与之对应，且满足如下性质：
1. 数乘对加法分配律：$lambda(alpha+beta)=lambda alpha+lambda beta$
2. 数乘对数的加法分配律：$(lambda+mu)alpha = lambda alpha + mu alpha$
3. 结合律：$(lambda mu) alpha=lambda(mu alpha)$
4. 单位元：$exists bold(1) in F, s.t." "bold(1) dot alpha = alpha$


因此，要证明$(V,+,dot)$是线性空间，就要证明：
1. $V$非空
2. $V$对$+,dot$封闭
3. $+,dot$在$V$上满足各自的四条性质 
不满足任何一条，都不是线性空间


设$A in CC^(m times n), x in CC^n$，齐次线性方程组$A x=0$的解集构成$CC$上的线性空间。（$W = {x in CC^n | A x = 0}$，$(W,+.dot)$构成线性空间，因为$A(lambda x_0+mu x_1)=lambda A x_0+mu A x_1 = 0$）

/ 线性运算: 加法和数乘称为线性运算。
/ 线性表示: 对指定元素只使用线性运算产生的结果。


/ 子空间: 设 $V$是$F$上的线性空间，$W$是$V$的非空子集，若$W$的向量关于$V$的加法、数乘运算也构成$F$上的线性空间，则称$W$是$V$的子空间。

/ 零子空间: 线性空间$V$中，${theta}$是线性空间，称为零子空间。
/ 平凡子空间: $V$和${theta}$是 $V$的平凡子空间。

过原点的平面是$RR^3$的子空间。

/ 子空间判别法: 若$V$是$F$上的线性空间，$W$是$V$的非空子集，以下命题等价：
1. $W$是$V$的子空间
2. a. $forall k in F, alpha in W$，有$k alpha in W$,
   b. $forall alpha, beta in W$，有$alpha + beta in W$.
3. $forall k,l in F, forall alpha, beta in W$，有$k alpha + l beta in W$

= 作业
// #image("image.png")

1) 假设零向量不唯一，即存在不同的$theta_1,theta_2 in V$使

$ forall alpha in V, exists ("-"alpha), s.t. alpha+("-"alpha) = theta_1=theta_2 $

由于线性空间对加法封闭，因此 $alpha + ("-"alpha)$ 只能有一个元素与其对应，因此 $theta_1$和$theta_2$ 不能是不同的元素。这与前面的假设矛盾，因此零向量唯一。

2) 假设 $exists alpha, beta, gamma in V$，其中 
$ cases(
  alpha + beta = theta ,
  gamma + beta = theta ,
) $，
即存在一个向量 $beta$，其存在两个不同的负向量 $alpha, gamma$. 则，
$
alpha + theta &= alpha \
alpha + (gamma + beta) &= alpha \
(alpha + beta) + gamma &= alpha \
theta + gamma &= alpha
$
同时，$theta+gamma = theta$. 由于线性空间对加法封闭，因此 $theta+gamma$ 只能对应一个结果，这与 $alpha,gamma$是不同的元素相矛盾。因此，任一元素的负向量都唯一。

*这里还有个很有意思的 Imply：* 等式的相等是否可以认为是元素的相同？等量代换的等式基本性质显然是可以使用的定理。然后，假设存在两个元素 $alpha, beta$，有 $alpha = beta$；根据 $alpha + theta = alpha$，可以代换得到 $alpha + theta = alpha = beta$。构造出这个“两个相同加法产生不同结果”的模式，就可以使用线性空间对加法的封闭性，证明$alpha$和$beta$必须是同一个元素了。

3) 

1. 
$
&&alpha + theta &= alpha &(1)\
&&1 dot alpha + 0 dot alpha &= (1+0) dot alpha = 1 dot alpha = alpha \
=> &&alpha + 0 dot alpha &= alpha &(2)
$

结合 (1), (2)，两边同时加上 $("-"alpha)$，有 $
alpha+("-"alpha)+theta &= alpha + ("-"alpha) + 0 dot alpha \
theta + theta &= theta + 0 dot alpha \
theta &= 0 dot alpha
$

2.

3.


4) 
