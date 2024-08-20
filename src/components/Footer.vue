<script setup lang="ts">
import { serverConfig } from '@/config/server';
</script>

<template>
  <div class="footer">
    <div>
      2024 {{ serverConfig.name }}.
    </div>
    <div>
      {{ serverConfig.slogan }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  width: 100%;
  padding: 30px 0 50px;
  background: #c2c2c2;
  div {
    width: fit-content;
    margin: 0 auto;
  }
}
</style>