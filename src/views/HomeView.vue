<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import NoteList from "@/components/home/NoteList.vue";
import { serverConfig } from "@/config/server"

// --- 配置参数 ---
const MAX_HEIGHT = window.innerHeight; // Banner 展开时的最大高度
const MIN_HEIGHT = 52.5;  // Banner 收缩后的最小高度 (Navbar高度)

const scrollY = ref(0);

const updateState = () => {
  scrollY.value = window.scrollY;
};

onMounted(() => {
  updateState();
  window.addEventListener('scroll', updateState);
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateState);
});

// --- 核心计算 ---

// 1. Banner 的动态高度
// 逻辑：初始 600，随着滚动减小，最小减到 60
const bannerHeight = computed(() => {
  const h = MAX_HEIGHT - scrollY.value;
  return Math.max(MIN_HEIGHT, h) + 'px';
});

// 2. 动态遮罩透明度 (可选，但推荐)
// 逻辑：一开始比较透(0.3)，缩到最后变成深色(0.9)，保证文字清晰
const overlayOpacity = computed(() => {
  const progress = Math.min(scrollY.value / (MAX_HEIGHT - MIN_HEIGHT), 1);
  return 0.3 + (0.6 * progress); // 从 0.3 变到 0.9
});

// 3. 标题缩放
// 逻辑：随滚动从 1.0 缩小到 0.4
const titleScale = computed(() => {
  const progress = Math.min(scrollY.value / (MAX_HEIGHT - MIN_HEIGHT), 1);
  return 1 - (0.6 * progress);
});

// 4. 标题位置微调
// 当变成导航栏时，padding 需要减小，否则文字会掉出盒子
const titlePadding = computed(() => {
  const progress = Math.min(scrollY.value / (MAX_HEIGHT - MIN_HEIGHT), 1);
  // 从 40px 减少到 10px (垂直居中)
  return (40 - (30 * progress)) + 'px';
});

</script>

<template>
  <div :style="{ height: `${MAX_HEIGHT}px`, width: '100%' }"></div>

  <div class="sticky-banner" :style="{ height: bannerHeight }">
    
    <img src='/assets/banner.jpg' class="banner-img" />
    
    <div 
      class="banner-overlay" 
      :style="{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }"
    ></div>

    <div 
      class="banner-title" 
      :style="{ 
        transform: `scale(${titleScale})`,
        paddingBottom: titlePadding,
        paddingRight: '60px' 
      }"
    >
      <span>{{ serverConfig.name }}</span>
    </div>
  </div>

  <div class="content">
    <NoteList />
  </div>
</template>

<style scoped lang="scss">
.sticky-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden; /* 裁剪多余的图片部分 */
  z-index: 1000; /* 保证在 NoteList 上面 */
  /* 加个阴影，区分内容和Header */
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  will-change: height;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 关键：保证图片填满容器且不变形 */
  object-position: center top; /* 关键：缩小时保留图片的上半部分，或者改成 center center */
  display: block;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  transition: background-color 0.1s linear; /* 顺滑过渡颜色 */
  pointer-events: none;
}

.banner-title {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  
  display: flex;
  justify-content: flex-end; /* 靠右 */
  align-items: flex-end;     /* 靠底 */
  
  font-size: 58px;
  color: white; /* 始终白色 */
  font-family: ubuntu, system-ui, sans-serif;
  font-weight: 600;
  
  transform-origin: right bottom; /* 缩放锚点 */
  will-change: transform, padding-bottom;
  
  white-space: nowrap;
  user-select: none;
  pointer-events: none;
}

.content {
  max-width: 1024px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  background-color: var(--color-background);
  min-height: 100vh;
  padding-top: 2rem;
}
</style>