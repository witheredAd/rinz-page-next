---
Published: 'True'
SpecTag: Maths
desc: >-
  估计类的方差下界。[!note] 定义 当总体分布族 ${p(x;theta);theta in Theta}$ 满足：支撑 $A_theta =
  {x;p(x;theta)>0}$ 与 $theta...
---


估计类的方差下界。

> [!note] 定义
> 当总体分布族 ${p(x;theta);theta in Theta}$ 满足：
> 1. 支撑 $A_theta = {x;p(x;theta)>0}$ 与 $theta$ 无关
>     此时可以定义 Fisher 信息量 $I(theta)=E_theta [partial / (partial theta) ln p(x;theta)]^2$
> 2. 对一切 $theta in Theta$，对任意满足 $E_theta|T| < +infinity$ （期望有界）的统计量 $T(bold(x))$，有
> $$
>   partial / (partial theta) E_theta (T) 
>     &eq.triple
>      partial / (partial theta) integral ... integral T dot p(bold(x);theta)d x_1 d x_2 ... d x_n \ 
>     &=
>      integral ... integral T dot partial / (partial theta) p(bold(x); theta) d x_1 d x_2 ... d x_n
> $$
> 称该分布族为 Cramér-Rao 正则族。
> 
> 若 $d^2 / (d theta^2) integral _(-infinity) ^(+infinity) p(x;theta) d x = integral _(-infinity) ^(+infinity) partial^2 / (partial theta^2) p(x;theta) d x$ $(upright(I))$，则有
> $$
> I(theta)=-E_theta [partial^2/(partial theta^2) ln p(x;theta)] (upright(I I))
> $$
> 此外对于统计量 $T$ 再定义 $I_T(theta)=E_theta [partial/(partial theta)ln p_T (t;theta)]^2$, $<=I_n (theta)=n I(theta)$

这是书上的原定义，但是看过后面的作业之后，我觉得这个定义太搞笑了。
实际上的逻辑应该是：
> [!note] 定义
> **正则条件**：
> 1. 支撑集 $A_theta = {x;p(x;theta)>0}$ 与 $theta$ 无关
> 2. $p(x;theta)$ 关于 $theta$ 足够平滑，且变化率有界（一般满足）
> 
> 满足正则条件的总体分布族，称为 Cramér-Rao 正则族。
> 
> 对于这些分布族，对一切 $theta in Theta$，对任意满足 $E_theta|T| < +infinity$ （期望有界）的统计量 $T(bold(x))$，有
> $$
>   partial / (partial theta) E_theta (T) 
>     &eq.triple
>      partial / (partial theta) integral ... integral T dot p(bold(x);theta)d x_1 d x_2 ... d x_n \ 
>     &=
>      integral ... integral T dot partial / (partial theta) p(bold(x); theta) d x_1 d x_2 ... d x_n
> $$
> 即其计算期望时，积分和求导可以互换。上述式子也可以写成：
> $$
>   partial / (partial theta) E_theta (T) 
>     &eq.triple
>      partial / (partial theta) integral T dot p(t;theta) d t \
>     &=
>      integral T dot partial / (partial theta) p(t; theta) d t
> $$
> **这其中，$T$ 作为统计量，其本身不含有 $theta$；仅在计算 $E(T)$ 时，由于其是 $T$ 在 $theta$ 参数作用下概率的加权积分 $integral T p(t;theta) d t$，故 $E(T)$ 含有 $theta$.** 也就是说，是 $p(t;theta)$ 引入了 $theta$.
> 
> 此时可以定义 Fisher 信息量 $$I(theta) 
> eq.triple E_theta [(partial / (partial theta) ln p(x;theta))^2]$$，其含义为对数似然函数变化率的大小。可以证得：对数似然函数变化率的均值永远为0，因此，使用其平方来比较其大小。变化率大，意味着 $theta$ 变化一点点就会让概率密度变化很大，也即能提供更多信息。
> 
> 在正则条件下，总有：
> $$
> I(theta) 
> eq.triple& E_theta [(partial / (partial theta) ln p(x;theta))^2] \ 
> =& -E_theta [partial^2 / (partial theta^2) ln p(x;theta)]
> $$
> 
>  此外对于统计量 $T$ 再定义：$$ I_T(theta)
>  &eq.triple E_theta [partial/(partial theta)ln p_T (t;theta)]^2, <=I_n (theta)=n I(theta) $$
>  也有 
>  $$
>  = -E_theta [partial^2 / (partial theta^2) ln p_T (t;theta)]
>  $$



> [!warning] 正则条件
> 正则条件存在的意义实际上是：
> $E_theta (T)$ 是一个变上下限积分 $integral_a(theta)^b(theta) f(t, theta) d t$。对其求导，根据莱布尼茨法则，有：
> $$ d/(d theta) E_theta (T) = 
>   integral_a(theta)^b(theta) (partial f(t, theta))/(partial theta) d t
> + f(b, theta) (d b(theta))/(d theta)
> - f(a, theta) (d a(theta))/(d theta)
> $$
> 其中，$a$和$b$ 就是支撑集的上下界。支撑集不变，则上式中后两项为 $0$. 此为支撑集条件的含义。
> 
> 这个定理要成立，还要求 $f(t, theta)=p(t;theta)$ 在 $(t, theta)$ 平面连续，且在 $theta in Theta$ 上，$a(theta), b(theta)$ 及其导数连续。这就是正则条件第二点的含义。
> 在 $theta$ 为一维的情况下，通过全微分公式即可计算得到。在更高维的参数空间下，需要勒贝格积分和测度集的相关结论，在此不做讨论。

以上是纯理论分析。应用中，基本只需要看支撑集条件，即支撑集与 $theta$ 无关。

**信息不等式**：对于 Cramér-Rao 正则族，且 $I(theta) < +infinity$，$T$ 对一切 $theta in Theta$ 方差有界，则 $E_theta (T)$ 对一切 $theta$ 可微，且 
$$
"Var"_theta (T)>= [(d E_theta (T)) / (d theta)]^2 /(n I(theta))
$$
下面将其应用到无偏估计类 $U_q$，则 $E_theta (T)=q(theta)$. 此时有
$$
"Var"_theta (T)>= [q'(theta)]^2 /(n I(theta))
$$
特别地，当 $q(theta)=theta$ 时，
$$
"Var"_theta (T)>= 1/(n I(theta))
$$
$[q'(theta)]^2 /(n I(theta))$ 称为 Cramér-Rao 下界（CRLB / C-R 下界）。


Fisher 信息是可加的，即对于相互独立的两个统计量 $T_1, T_2$，有 $$I_(T_1, T_2) (theta) = I_T_1 (theta) + I_T_2 (theta)$$，这是因为 
$$
I_(T_1, T_2)=-E_theta (partial^2 / (partial theta^2) ln p(t_1, t_2;theta))
$$
，而 $ln p(t_1, t_2; theta) = ln p(t_1; theta) + ln p(t_2; theta)$，故 
$$
I_(T_1, T_2) 
&= -E_theta (partial ^2 / (partial theta ^2) ln p(t_1; theta) + partial ^2 / (partial theta ^2) ln p(t_2; theta)) \
&= I_T_1 + I_T_2
$$
