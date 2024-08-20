<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useKatexCSS } from '@/stores/KatexCSSLazyLoader';
import { useStarryNightCSS } from '@/stores/StarryNightCSSLoader';

useKatexCSS()
useStarryNightCSS()
</script>

<template>
  <div class="page">
    <RouterView />
  </div>
</template>

<style scoped>
.page {
  max-width: 768px;
  padding: 2rem;
  margin: 0 auto;
}
</style>