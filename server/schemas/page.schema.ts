import { z } from 'h3-zod'

export const PageSchema = z.object({
  page: z.coerce.number().optional().default(1),
  size: z.coerce.number().optional().default(20),
})
