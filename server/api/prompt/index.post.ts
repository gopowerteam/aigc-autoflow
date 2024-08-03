import { createInsertSchema } from 'drizzle-zod'
import { PromptSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = createInsertSchema(PromptSchema)

export default defineAuthEventHandler(async (event) => {
  const body = await useSafeBody(event, BodySchema)
  return db.insert(PromptSchema).values(body).returning()
})
