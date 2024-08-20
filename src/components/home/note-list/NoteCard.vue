<script setup lang="ts">
import Card from 'primevue/card';

defineProps<{
  title: string,
  content: string,
  url: string,
}>()
</script>

<template>
  <a :href="url">
    <Card>
      <template #title>
        {{ title }}
      </template>
      <template #content>
        <div class="content">
          {{ content }}
        </div>
      </template>
    </Card>
  </a>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>