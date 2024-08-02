import { eq } from 'drizzle-orm'
import { PromptSchema } from '~/drizzle/schemas'
import { IdSchema } from '~/server/schemas/id.schema'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async (event) => {
  const { id } = await useSafeParams(event, IdSchema)

  return db.delete(PromptSchema).where(
    eq(PromptSchema.id, id),
  )
})
