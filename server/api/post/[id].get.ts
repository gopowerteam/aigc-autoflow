import { eq } from 'drizzle-orm'
import { PostSchema } from '~/drizzle/schemas'
import { IdSchema } from '~/server/schemas/id.schema'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async (event) => {
  const { id } = await useSafeParams(event, IdSchema)

  return db.query.PostSchema.findFirst({
    where: eq(PostSchema.id, id),
  })
})
