import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { PromptSchema } from '~/drizzle/schemas'
import { IdSchema } from '~/server/schemas/id.schema'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = createInsertSchema(PromptSchema).partial()

export default defineAuthEventHandler(async (event) => {
  const { id } = await useSafeParams(event, IdSchema)
  const data = await useSafeBody(event, BodySchema)

  return db.update(PromptSchema).set(data).where(
    eq(PromptSchema.id, id),
  )
})
