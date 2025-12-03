<script lang="js" setup>
import { onMounted } from 'vue';

const startParticle = (function() {
    // 配置参数
    const CONFIG = {
        particleCount: 30,    // 每次点击产生的粒子数量
        gravity: 0.5,         // 重力系数
        fadeSpeed: 0.02,      // 消失速度
        initialVelocity: 8    // 初始速度范围
    };

    // 监听全站点击事件
    document.addEventListener('click', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        createExplosion(x, y);
    });

    // 创建爆炸效果
    function createExplosion(x, y) {
        for (let i = 0; i < CONFIG.particleCount; i++) {
            createParticle(x, y);
        }
    }

    // 创建单个粒子
    function createParticle(x, y) {
        const particle = document.createElement('div');
        document.body.appendChild(particle);

        // 随机大小 (5px - 10px)
        const size = Math.random() * 5 + 5;
        
        // 随机颜色 (使用HSL以获得彩虹色)
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        // 随机速度和角度
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * CONFIG.initialVelocity;
        
        let velX = Math.cos(angle) * velocity;
        let velY = Math.sin(angle) * velocity;

        // 设置粒子初始样式
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none'; // 关键：让鼠标穿透粒子，不影响点击下方元素
        particle.style.zIndex = '9999';        // 保证粒子在最上层
        particle.style.transform = 'translate(-50%, -50%)'; // 居中定位

        // 动画状态
        let opacity = 1;
        let posX = x;
        let posY = y;

        // 动画循环
        function animate() {
            // 应用重力
            velY += CONFIG.gravity;
            
            // 更新位置
            posX += velX;
            posY += velY;
            
            // 更新透明度
            opacity -= CONFIG.fadeSpeed;

            // 应用样式更新
            particle.style.left = posX + 'px';
            particle.style.top = posY + 'px';
            particle.style.opacity = opacity;
            
            // 稍微缩小一点
            particle.style.transform = `translate(-50%, -50%) scale(${opacity})`;

            // 如果还没完全消失，继续下一帧
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                // 消失后从DOM中移除，防止内存泄漏
                particle.remove();
            }
        }

        requestAnimationFrame(animate);
    }
});

onMounted(() => {
    startParticle();
})
</script>

<template>
    
</template>