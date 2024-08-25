import { desc, eq } from 'drizzle-orm'
import { createSelectSchema } from 'drizzle-zod'
import { PostSchema, TaskSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

// const QuerySchema = createSelectSchema(TaskSchema).partial()

export default defineAuthEventHandler(async () => {
  // const query = await useSafeQuery(event, QuerySchema)
  return db.query.TaskSchema.findMany({
    orderBy: [desc(TaskSchema.createdAt)],
  })
})
