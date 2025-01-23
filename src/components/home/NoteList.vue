<script setup lang="ts">
import { noteMetadata } from 'virtual:note-config'
import NoteCard from './note-list/NoteCard.vue'

const notes = noteMetadata;
console.log(notes)
</script>

<template>
  <ul class="container">
    <li class="card-wrapper" v-for="item in notes">
      <NoteCard
        :title="item.meta.title ?? item.path"
        :content="item.meta.desc ?? ''"
        :url="`/note/${item.path}`"
      />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.container {
  list-style: none;
  column-gap: 0;
  padding: 0;
  column-count: 4;

  .card-wrapper {
    width: 100%;
    padding: 5px;
    box-sizing: border-box;
    break-inside: avoid;
  }
}
</style>