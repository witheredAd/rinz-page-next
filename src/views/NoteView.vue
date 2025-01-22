<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useKatexCSS } from '@/stores/KatexCSSLazyLoader';
import { useStarryNightCSS } from '@/stores/StarryNightCSSLoader';
import { computed, defineAsyncComponent, watch } from 'vue';

useKatexCSS()
useStarryNightCSS()

const props = defineProps<{
  noteName: string
}>()

const noteContent = computed(() => {
  const noteName = props.noteName
  if (noteName.endsWith('mdx')) {
    return defineAsyncComponent(
      () => import(`../notes/${noteName.slice(0, noteName.length - 4)}.mdx`)
    )
  } else if (noteName.endsWith('md')) {
    return defineAsyncComponent(
      () => import(`../notes/${noteName.slice(0, noteName.length - 3)}.md`)
    )
  }
})

</script>

<template>
  <div class="page">
    <!-- <RouterView /> -->
     <component :is="noteContent" />
  </div>
</template>

<style scoped>
.page {
  max-width: 768px;
  padding: 2rem;
  margin: 0 auto;
}
</style>