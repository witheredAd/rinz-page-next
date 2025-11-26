<script setup lang="ts">
import { computed } from 'vue';
import 'primeicons/primeicons.css';

// 定义 Props：接收分类列表和当前选中的分类名
interface CategoryItem {
  name: string;
  count: number;
  color: string;
  icon: string;
}

const props = defineProps<{
  categories: CategoryItem[];
  activeCategoryName: string | null;
}>();

// 定义 Emits：向父组件发送切换分类的事件
const emit = defineEmits<{
  (e: 'switch', categoryName: string): void;
  (e: 'close'): void;
}>();

// 计算出需要显示在 Dock 里的分类（排除当前选中的）
const dockItems = computed(() => {
  if (!props.activeCategoryName) return [];
  return props.categories.filter(c => c.name !== props.activeCategoryName);
});
</script>

<template>
  <Transition name="dock-slide">
    <div v-if="activeCategoryName" class="category-dock-container">
      <div class="dock-content">
        
        <button 
          v-for="item in dockItems" 
          :key="item.name"
          class="dock-item category-switch"
          :style="{ '--item-color': item.color }"
          @click="emit('switch', item.name)"
          :title="`Switch to ${item.name}`"
        >
          <i :class="['dock-icon', item.icon]"></i>
        </button>

        <div class="dock-divider"></div>
        
        <button 
          class="dock-item home-button"
          @click="emit('close')"
          title="Back to Home"
        >
          <i class="pi pi-home dock-icon"></i>
        </button>

      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
/* Dock 容器：固定在底部中央 */
.category-dock-container {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100; /* 确保在最上层 */
}

/* Dock 内容：毛玻璃效果的胶囊 */
.dock-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.8); /* 半透明白色 */
  backdrop-filter: saturate(180%) blur(20px); /* 毛玻璃特效 */
  border-radius: 999px; /* 胶囊形状 */
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.05); /* 精致的阴影和边框 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 适配深色模式的微调 */
}

/* Dock 项目按钮基础样式 */
.dock-item {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  &:hover {
    transform: scale(1.15) translateY(-2px); /* 悬停放大上浮 */
  }
  &:active {
    transform: scale(0.95);
  }
}

/* 分类切换按钮 */
.category-switch {
  background: var(--item-color); /* 使用分类颜色 */
  color: white;
  box-shadow: 0 4px 10px -2px rgba(0,0,0,0.2);

  .dock-icon {
    font-size: 1.2rem;
  }

  /* 悬停时的高光效果 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: white;
    opacity: 0;
    transition: opacity 0.2s;
  }
  &:hover::after {
    opacity: 0.2;
  }
}

/* 回到主页按钮 */
.home-button {
  background: var(--color-background-mute); /* 使用柔和的背景色 */
  color: var(--color-text);
  
  .dock-icon {
    font-size: 1.3rem;
    opacity: 0.8;
  }

  &:hover {
    background: var(--color-background-soft);
    color: var(--p-primary-color); /* 悬停变主题色 */
  }
}

/* 分割线 */
.dock-divider {
  width: 1px;
  height: 24px;
  background-color: var(--color-border);
  opacity: 0.5;
  margin: 0 0.25rem;
}

/* --- Vue Transition 动画 --- */
/* Dock 从底部滑入滑出 */
.dock-slide-enter-active,
.dock-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dock-slide-enter-from,
.dock-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 100%); /* 从屏幕下方移入 */
}

/* 适配深色模式 (可选) */
@media (prefers-color-scheme: dark) {
  .dock-content {
    background: rgba(30, 30, 30, 0.8);
    border-color: rgba(255, 255, 255, 0.05);
  }
  .home-button {
      background: rgba(255,255,255,0.1);
      &:hover { background: rgba(255,255,255,0.2); }
  }
}
</style>