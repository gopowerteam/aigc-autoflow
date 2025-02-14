import { eq } from 'drizzle-orm'
import { AigcEnglishContentSchema } from '~/drizzle/schemas'
import { IdSchema } from '~/server/schemas/id.schema'

export default defineEventHandler(async (event) => {
  const { id } = await useSafeParams(event, IdSchema)
  return db.query.AigcEnglishContentSchema.findFirst({
    where: eq(
      AigcEnglishContentSchema.id,
      id,
    ),
    with: {
      sentences: true,
    },
  })
})
