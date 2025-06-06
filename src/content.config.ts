import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const article = defineCollection({
  loader: glob({ base: './src/content/article', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
  }),
})

export const collections = { article }
