import { createInsertSchema } from 'drizzle-zod'
import { PromptSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = createInsertSchema(PromptSchema)

export default defineAuthEventHandler(async (event) => {
  const body = await useSafeBody(event, BodySchema)

  if (!body.template.includes('{input}')) {
    throw createError('模板中必须包含输入占位符: {input}')
  }

  return db.insert(PromptSchema).values(body).returning()
})
