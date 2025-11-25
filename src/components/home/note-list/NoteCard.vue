<script setup lang="ts">
import Card from 'primevue/card';
import Tag from 'primevue/tag';

defineProps<{
  title: string,
  content: string,
  url: string,
  specTag?: string
}>()
</script>

<template>
  <a :href="url">
    <Card>
      <template #title>
        {{ title }}
        <Tag :value="specTag" v-if="specTag" />
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