<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import HomeView from './views/HomeView.vue'
</script>

<template>
  <NavBar />
  <div id="filter-teleport-target"></div>
  <HomeView />
</template>

<style scoped>
#filter-teleport-target {
  position: sticky; 
  z-index: 1002; 
  margin-top: calc(100vh - 60px); 
  margin-bottom: calc(-100vh + 60px - 57.5px);
  top: 0;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
</style>
