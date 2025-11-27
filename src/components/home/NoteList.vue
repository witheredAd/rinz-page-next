<script setup lang="ts">
import { noteMap } from 'virtual:note-config'
import NoteCard from './note-list/NoteCard.vue'
import { computed, nextTick, ref } from 'vue';
import 'primeicons/primeicons.css';
import { useRouter } from 'vue-router';

// --- 数据处理 ---

interface NoteItem {
  path: string;
  category: string;
  meta: any;
  date?: string; 
}

// --- 1. 确保元数据定义完整 (保持你现有的即可，确认有 color 和 icon) ---
const categoryMeta: Record<string, { color: string; icon: string }> = {
  'DevNotes': { color: 'var(--p-blue-500, #3B82F6)', icon: 'pi pi-code' },
  'Language': { color: 'var(--p-teal-500, #14B8A6)', icon: 'pi pi-globe' },
  'Maths':    { color: 'var(--p-orange-500, #F97316)', icon: 'pi pi-calculator' },
  'Tests':    { color: 'var(--p-purple-500, #A855F7)', icon: 'pi pi-file-edit' },
  'default':  { color: 'var(--p-surface-500, #64748b)', icon: 'pi pi-folder' },
};
// 辅助函数：获取分类的元数据
function getMeta(categoryName: string) {
  return categoryMeta[categoryName] || categoryMeta['default'];
}

// 1. 扁平化所有笔记
const allNotes = computed<NoteItem[]>(() => {
  return Object.entries(noteMap).flatMap(([category, notes]) => 
    notes.map(note => ({
      ...note,
      category,
      date: note.meta.date 
    }))
  ); // 建议此处按日期倒序排序
});

// 2. 提取最新的一篇 (用于 Spotlight)
const latestNote = computed(() => {
  return allNotesInDateOrder.value[0];
});

const allNotesInDateOrder = computed(() => {
  return allNotes.value.sort((a, b) => {
    const dateA = new Date(a.date || '1970-01-01').getTime();
    const dateB = new Date(b.date || '1970-01-01').getTime();
    return dateB - dateA; // 最新的在前面
  });
});

// 3. 筛选逻辑
const categories = ['All', ...Object.keys(noteMap)];
const currentFilter = ref('All');

const visibleNotes = computed(() => {
  if (currentFilter.value === 'All') {
    // 如果是 All，我们要排除掉第一篇（因为第一篇已经展示在 Spotlight 里了）
    // 这样避免重复，或者你可以选择不排除，看你喜好
    return allNotesInDateOrder.value.filter(n => n !== latestNote.value);
  }
  return allNotesInDateOrder.value.filter(n => n.category === currentFilter.value);
});

const masonryRef = ref<HTMLElement | null>(null);


function setFilter(cat: string) {
  currentFilter.value = cat;

  nextTick(() => {
    // 重置滚动位置到顶部
    if (masonryRef.value) {
      masonryRef.value.scrollTop = 0;
      const rect = masonryRef.value.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;
      
      const offset = 140; 
      const targetPosition = absoluteTop - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
}

const router = useRouter();

function openNote(note: NoteItem) {
  router.push(`/note/${note.path}`);
}
</script>

<template>
  <Teleport to="#filter-teleport-target">
    <nav class="filter-bar">
      <button 
        v-for="cat in categories" 
        :key="cat"
        class="filter-chip"
        :class="{ active: currentFilter === cat }"
        @click="setFilter(cat)"
      >
        {{ cat }}
      </button>
    </nav>
  </Teleport>

  <div class="blog-container">
    <div class="masonry-container" ref="masonryRef">
      <div 
        v-if="currentFilter === 'All' && latestNote" 
        class="card-wrapper spotlight-wrapper"
        @click="openNote(latestNote)"
      >
        <div class="widget-spotlight">
           <div class="spotlight-header">
             <span class="spotlight-tag">LATEST DROP</span>
             <span class="spotlight-date">{{ latestNote.meta.date || 'Today' }}</span>
           </div>
           
           <div class="spotlight-content">
              <h3>{{ latestNote.meta.title || latestNote.path }}</h3>
              <p :class="{ 'no-desc': !latestNote.meta.desc }">
                {{ latestNote.meta.desc || 'No description available.' }}
              </p>
           </div>
           
           <div class="spotlight-bg-icon">
              <i class="pi pi-bolt"></i>
           </div>
        </div>
      </div>

      <div 
        class="card-wrapper" 
        v-for="note in visibleNotes" 
        :key="note.path"
        @click="openNote(note)"
      >
        <NoteCard
          :title="note.meta.title ?? note.path"
          :content="note.meta.desc ?? ''"
          :specTag="note.meta.SpecTag || note.category"
          :clickable="false" 
          :date="note.meta.date" 
          :color="getMeta(note.category).color"
          :icon="getMeta(note.category).icon"
        />
      </div>

    </div>

  </div>
</template>

<style lang="scss" scoped>
.blog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem 4rem;
}

/* --- 筛选栏 --- */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  padding: 11px 0;
  
  background: transparent;
  transition: all 0.3s ease;
}

.filter-chip {
  background: var(--color-background-soft);
  border: 1px solid transparent;
  border-radius: 99px;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }

  &.active {
    background: rgba(0,0,0,0.0);
    color: var(--color-background);
  }
}

/* --- 瀑布流布局 (核心) --- */
.masonry-container {
  /* 你的 4 列布局 */
  column-count: 4;
  column-gap: 1.5rem; /* 列间距 */
  
  /* 响应式断点 */
  @media (max-width: 1200px) { column-count: 3; }
  @media (max-width: 900px) { column-count: 2; }
  @media (max-width: 600px) { column-count: 1; }
}

.card-wrapper {
  /* 防止卡片在列之间被截断 */
  break-inside: avoid;
  margin-bottom: 1.5rem; /* 行间距 */
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }
}

/* --- Spotlight 黑色卡片设计 --- */
.widget-spotlight {
  /* 确保它在瀑布流里看起来是一个完整的块 */
  width: 100%;
  min-height: 240px; /* 稍微高一点，突出显示 */
  background: linear-gradient(145deg, #18181b 0%, #09090b 100%);
  color: #ffffff; /* 强制白色文字 */
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.3);

  .spotlight-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .spotlight-tag {
    padding: 6px 10px;
    border-radius: 6px;
    background: #ffffff;
    color: #000000;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  
  .spotlight-date {
      font-size: 0.8rem;
      opacity: 0.6;
      font-family: monospace;
  }

  .spotlight-content {
    position: relative;
    z-index: 2;
    margin-top: 2rem;

    h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.75rem;
      line-height: 1.1;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.8);
      
      /* 你喜欢的 "No description" 样式 */
      &.no-desc {
        color: rgba(255, 255, 255, 0.3);
        font-style: italic;
      }
    }
  }
  
  /* 巨大的背景图标装饰 */
  .spotlight-bg-icon {
    position: absolute;
    bottom: -20px;
    right: -25px;
    font-size: 9rem;
    color: white;
    opacity: 0.05;
    transform: rotate(-15deg);
    pointer-events: none;
    z-index: 1;
  }
}

/* --- 底部抽屉 (保持之前一致) --- */
.reader-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  animation: fade-in 0.3s ease;
}

.reader-sheet {
  width: 100%;
  height: 85vh;
  background: var(--color-background);
  border-radius: 20px 20px 0 0;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.3);
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.sheet-handle {
  width: 50px;
  height: 5px;
  background: var(--color-border);
  border-radius: 10px;
  margin: 0 auto 2rem;
  opacity: 0.5;
}

@keyframes fade-in { from { opacity: 0; } to { opacity: 1; }}
@keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); }}
</style>