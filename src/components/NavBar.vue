<script lang="ts" setup>
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs'

import { tabConfig } from '@/config/tabs'
import Styles from './NavBar.module.scss'
</script>

<template>
  <div :class="Styles.navbar">
    <Tabs>
      <TabList>
        <Tab v-for="tab in tabConfig" :key="tab.title" :value="tab.url">
          {{ tab.title }}
        </Tab>
      </TabList>
    </Tabs>
  </div>
</template>