import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'

import mdx from '@mdx-js/rollup'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeStarryNight from 'rehype-starry-night'
import rehypeCallouts from 'rehype-callouts'
import rehypeTypst from '@myriaddreamin/rehype-typst'
import rehypeTypstContent from '@local/rehype-typst-content'
import { all } from '@wooorm/starry-night'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

import noteAutoPack from './vite-plugins/note-auto-pack/index'
import remarkWikiImage from './vite-plugins/remark-wiki-image/index'
import remarkSimpleNotation from './vite-plugins/remark-simple-notation/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    noteAutoPack(),
    mdx({
      jsxImportSource: 'vue',
      remarkPlugins: [remarkMath, remarkFrontmatter, remarkWikiImage, remarkSimpleNotation, [remarkMdxFrontmatter, { name: '__page' }]],
      rehypePlugins: [rehypeCallouts, rehypeTypstContent, [rehypeStarryNight, { grammars: all }]],
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
