<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <NavBar />
  <div id="filter-teleport-target"></div>
  <div class="main-content">
    <RouterView />
  </div>
  <Footer />
</template>

<style scoped>
#filter-teleport-target {
  position: sticky; 
  z-index: 1002; 
  margin-top: calc(100vh - 60px); 
  margin-bottom: calc(-100vh + 60px - 57.5px);
  top: 0;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}
</style>
