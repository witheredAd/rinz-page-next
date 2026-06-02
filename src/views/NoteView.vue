<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useMathFontCSS } from '@/stores/MathFontCSSLazyLoader';
import { useStarryNightCSS } from '@/stores/StarryNightCSSLoader';
import { computed, defineAsyncComponent, watch } from 'vue';
import { noteMap } from 'virtual:note-config'

useMathFontCSS()
useStarryNightCSS()

const props = defineProps<{
  noteName: string,
  folder: string
}>()

const noteMeta = computed(() => {
  const notes = noteMap[props.folder]
  if (!notes) return null
  return notes.find(n => n.path === `${props.folder}/${props.noteName}`)?.meta
})

const noteTitle = computed(() => {
  return noteMeta.value?.title || props.noteName.replace(/\.(md|mdx)$/, '')
})

const noteContent = computed(() => {
  const noteName = props.noteName
  const noteFolder = props.folder
  if (noteName.endsWith('mdx')) {
    return defineAsyncComponent(
      () => import(`../notes/${noteFolder}/${noteName.slice(0, noteName.length - 4)}.mdx`)
    )
  } else if (noteName.endsWith('md')) {
    return defineAsyncComponent(
      () => import(`../notes/${noteFolder}/${noteName.slice(0, noteName.length - 3)}.md`)
    )
  }
})

</script>

<template>
  <div class="page">
    <!-- <RouterView /> -->
     <time v-if="noteMeta?.date" class="note-date"><i>Updated on {{ noteMeta.date }}</i></time>
     <h1>{{ noteTitle }}</h1>
     <component :is="noteContent" />
  </div>
</template>

<style scoped>
.page {
  max-width: 768px;
  padding: 2rem;
  margin: 0 auto;
}
h1 {
  margin-top: -0.5rem;
}
.note-date {
  display: block;
  font-size: 0.8rem;
  color: var(--p-surface-500, #64748b);
  margin-top: 5.5rem;
}
</style>