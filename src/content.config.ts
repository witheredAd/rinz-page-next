// Import the glob loader
import { glob } from "astro/loaders";
// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `loader` and `schema` for each collection
const notes = defineCollection({
    loader: glob({ pattern: '**/[^_]*.(md|mdx)', base: "./src/notes" }),
    schema: z.object({
      title: z.string().optional(),
      date: z.string().optional(),
      desc: z.string(),
      specTag: z.string().optional(),
      // author: z.string(),
      // image: z.object({
      //   url: z.string(),
      //   alt: z.string()
      // }),
      // tags: z.array(z.string())
    }),
});
// Export a single `collections` object to register your collection(s)
export const collections = { notes };