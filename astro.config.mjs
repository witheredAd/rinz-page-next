import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import pagefind from "astro-pagefind";

// 引入你的插件
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeStarryNight from 'rehype-starry-night';
import rehypeCallouts from 'rehype-callouts';
import rehypeTypstContent from '@local/rehype-typst-content'; // 确保路径正确
import { all } from '@wooorm/starry-night';

const MARKDOWN_CONFIG = {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeCallouts, rehypeTypstContent, [rehypeStarryNight, { grammars: all }]],
  }

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  },
  markdown: MARKDOWN_CONFIG,
  integrations: [
    vue({ 
        jsx: true,
        appEntrypoint: '/src/main@vue.ts'
    }),
    mdx(),
    pagefind(),
  ],
});