import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import mdx from '@mdx-js/rollup'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import rehypeStarryNight from 'rehype-starry-night'
import { all } from '@wooorm/starry-night'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import noteAutoPack from './vite-plugins/note-auto-pack/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    noteAutoPack(),
    mdx({
      jsxImportSource: 'vue',
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, [rehypeStarryNight, { grammars: all }]],
    }),
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})
