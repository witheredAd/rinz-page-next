<script setup lang="ts">
import NoteList from "@/components/home/NoteList.vue";
import { serverConfig } from "@/config/server"

</script>

<template>
  <div class="banner-container">
    <img src='/assets/banner.jpg' class="bannerImg" />
    <div class="title">
      <span>{{ serverConfig.name }}</span>
    </div>
  </div>
  <div class="content">
    <NoteList />
  </div>
</template>

<style scoped lang="scss">
.bannerImg {
  width: 100%;
}

.banner-container { 
  margin-top: -58px;
  position: relative;
  font-size: 0;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      rgba(0,0,0,0.3) 0%,
      rgba(0,0,0,0.1) 10%);
  }

  .title {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    font-size: 58px;
    padding: 0 100px 40px;
    color: white;
    font-family: ubuntu, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    -webkit-box-reflect: below -200px;
  }
}

.content {
  max-width: 1024px;
  margin: 0 auto;
}
</style>