import { createInsertSchema } from 'drizzle-zod'
import { z } from 'h3-zod'
import { PostSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = createInsertSchema(PostSchema, {
  tags: z.array(z.string()),
})

export default defineAuthEventHandler(async (event) => {
  const body = await useSafeBody(event, BodySchema)
  return db.insert(PostSchema).values(body)
})
