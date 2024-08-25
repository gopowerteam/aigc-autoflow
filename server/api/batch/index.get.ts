import { desc } from 'drizzle-orm'
import { BatchSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async () => {
  return db.query.BatchSchema.findMany({
    orderBy: [desc(BatchSchema.createdAt)],
    with: {
      tasks: true,
    },
  })
})
