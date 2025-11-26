<script setup lang="ts">
import { computed } from 'vue';
import 'primeicons/primeicons.css';

// 定义 Props
const props = defineProps<{
  title: string;
  content: string;
  url?: string;      // 可选，如果外部包裹了链接则不需要
  specTag: string;   // 显示在标签上的文字
  date?: string;     // 新增：日期
  color?: string;    // 新增：主题色 (用于标签和图标)
  icon?: string;     // 新增：背景图标 (PrimeIcons class)
  clickable?: boolean; // 是否自身带有点击效果 (默认 true)
}>();

// 处理没有描述的情况
const hasContent = computed(() => props.content && props.content.trim().length > 0);
const displayContent = computed(() => hasContent.value ? props.content : 'No description available.');

// 计算主题色，给个默认值防止没传
const themeColor = computed(() => props.color || 'var(--p-primary-color, #3B82F6)');
</script>

<template>
  <component 
    :is="url ? 'a' : 'div'" 
    :href="url"
    class="note-card-enhanced"
    :class="{ 'is-clickable': clickable !== false }"
    :style="{ '--theme-color': themeColor }"
  >
    
    <div class="card-header">
      <span class="category-pill">{{ specTag }}</span>
      <span v-if="date" class="card-date">{{ date }}</span>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p 
        class="card-desc" 
        :class="{ 'no-desc': !hasContent }"
      >
        {{ displayContent }}
      </p>
    </div>

    <i v-if="icon" :class="['bg-deco-icon', icon]"></i>
    
  </component>
</template>

<style lang="scss" scoped>
.note-card-enhanced {
  display: block; /* 确保 a 标签也是块级 */
  position: relative; /* 为绝对定位的背景图标做参照 */
  background-color: var(--color-background);
  border: 1px solid var(--color-border); /* 精致的细边框 */
  border-radius: 16px; /* 与 Spotlight 统一圆角 */
  padding: 1.25rem;
  text-decoration: none; /* 去除 a 标签下划线 */
  color: var(--color-text);
  overflow: hidden; /* 裁剪超出边界的背景图标 */
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03); /* 基础微弱阴影 */

  /* 只有在允许点击时才启用 Hover 效果 */
  &.is-clickable {
    cursor: pointer;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); /* 悬浮时加深阴影 */
      border-color: transparent; /* 悬浮时隐藏边框，强调阴影 */
      
      /* hover 时让背景图标稍微清晰一点点，增加互动感 */
      .bg-deco-icon {
        opacity: 0.12;
        transform: rotate(-10deg) scale(1.1);
      }
    }
  }
}

/* --- Header 部分 --- */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2; /* 确保文字在背景图标之上 */
}

.category-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  /* 使用传入的主题色，背景淡化，文字深色 */
  background-color: color-mix(in srgb, var(--theme-color) 15%, transparent);
  color: var(--theme-color);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.card-date {
  font-size: 0.8rem;
  opacity: 0.6;
  font-family: monospace; /* 使用等宽字体增加科技感，和 Spotlight 呼应 */
}

/* --- Body 部分 --- */
.card-body {
  position: relative;
  z-index: 2;
}

.card-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.3;
  /* 限制标题最多 2 行 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  opacity: 0.8;
  /* 限制描述最多 3 行 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* 没有描述时的样式 (斜体灰色) */
  &.no-desc {
    opacity: 0.5;
    font-style: italic;
  }
}

/* --- 背景装饰图标 --- */
.bg-deco-icon {
  position: absolute;
  bottom: -15px;
  right: -20px;
  font-size: 7rem; /* 巨大 */
  color: var(--theme-color);
  opacity: 0.08; /* 极其透明 */
  transform: rotate(-15deg);
  pointer-events: none; /* 不响应鼠标事件 */
  z-index: 1; /* 在最底层 */
  transition: all 0.3s ease;
}
</style>