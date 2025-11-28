---
Published: 'True'
SpecTag: 笔记
desc: >-
  其实就是之前研究过的相机坐标系，针孔相机模型。 ![[Pasted image 20250916141349.png]]
  相机内外参矩阵是在计算相机——世界坐标换算的时候，把一些相机的焦距、位姿（位置
---


其实就是之前研究过的相机坐标系，针孔相机模型。
![[Pasted image 20250916141349.png]]
相机内外参矩阵是在计算相机——世界坐标换算的时候，把一些相机的焦距、位姿（位置和旋转）统一写到两个矩阵中的表示。
首先，根据相似三角形，右图中有：
```typst
$ f/z_c = x / x_c = y / y_c $
```
其中 $z_c, x_c, y_c$ 是以相机为原点、相机光轴为z轴的，物体的真实坐标（相机坐标系）。$f$是相机焦距。$z_c$其实就是物距。
$x,y$则称为像素坐标系。更确切地说，像素坐标系以左上角为原点，因此还要再加上照片的一半像素，像素坐标系$P_x$的准确定义为：
```typst
$ cases(
  u = x_c f / z_c dot 1/("dX") + c_x ,
  v = y_c f / z_c dot 1/("dY") + c_y 
)
$
```
其中，dX和dY是物理距离到像素距离的换算，分别表示一个像素在相机感光板上的物理宽度、高度。也把 $f/(d X)$ 写为 $f_x$， $f/(d Y)$ 写为 $f_y$.
写成矩阵形式：
```typst
#let mat = math.mat.with(delim: "[")
$
z_c mat(u;v;1) = mat(
  f_x, 0, c_x;
  0, f_y, c_y;
  0,    0,  1;
) mat(x_c; y_c; z_c)
eq.triple K P_c
$
```
$P_c$ 是相机坐标系下物体的坐标 $(x_c, y_c, z_c)$，$K$ 就称为相机的内参矩阵（intrinsics）。

外参则保存相机的位置和姿态信息。怎么算的不是太重要，以后再看。
#todo

将相机坐标系表示为世界坐标的旋转和平移变换，则有
```typst
#let mat = math.mat.with(delim: "[")
$
P_c = mat(x_c;y_c;z_c;1) = mat(R, t; 0^3, 1) mat(x_w;y_w;z_w;1) = R P_w + t
$
```
其中$R$是3x3的旋转矩阵，$t$是3x1的平移向量。这个矩阵就称为相机的外参 $T$.



综合内外参的讨论，从像素到世界坐标系的转换，就有：
```typst
#let mat = math.mat.with(delim: "[")
$
z_c mat(u;v;1) = K P_c = K mat(R,t;0^3,1) P_w = K T P_w
$
```
要让 $K$ 真正参与后面齐次坐标的运算，需要给 $K$ 的右侧加一列 0，使其变为 3x4 的矩阵。这叫做“齐次化”。

参考链接：
[SLAM入门之视觉里程计(2)：相机模型（内参数，外参数） - Brook_icv - 博客园](https://www.cnblogs.com/wangguchangqing/p/8126333.html#autoid-0-5-0)
[相机内参和外参 - 知乎](https://zhuanlan.zhihu.com/p/144307108)


至于 LiDAR 的内参，根据[What Is Lidar-Camera Calibration? - MATLAB & Simulink](https://ww2.mathworks.cn/help/lidar/ug/lidar-camera-calibration.html)，LiDAR的内参是厂商调校好的，只需要考虑外参，也就是LiDAR的位姿。内参的相关研究可以参考[论文阅读2---多线激光lidar内参标定原理_多线激光雷达的内参-CSDN博客](https://blog.csdn.net/qq_45701501/article/details/135779662) 或者原文《LIDAR Velodyne HDL-64E Calibration Using Pattern Planes》。

本来看这个topic是以为ITS数据集提供了LiDAR的内参（）后来一看发现并没有，只提供了LiDAR的位姿和外参，和V2XSet相比，相当于把外参直接给了，和内参没有什么关系。
对于LiDAR来说，需要根据位姿把LiDAR扫出的点云转换到世界坐标系，这还是合理的。
