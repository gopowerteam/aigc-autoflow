import { desc } from 'drizzle-orm'
import { PostSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async () => {
  return db.query.PostSchema.findMany({
    orderBy: [desc(PostSchema.createdAt)],
  })
})
