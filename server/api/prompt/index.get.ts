import { desc } from 'drizzle-orm'
import { PromptSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async () => {
  return db.query.PromptSchema.findMany({
    orderBy: [desc(PromptSchema.createdAt)],
  })
})
