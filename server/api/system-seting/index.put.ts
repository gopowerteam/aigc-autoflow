import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { SystemSettingSchema } from '~/drizzle/schema'
import { IdSchema } from '~/server/schemas/id.schema'

const Schema = createInsertSchema(SystemSettingSchema)

export default defineEventHandler(async (event) => {
  const { id } = await useSafeParams(event, IdSchema)
  const data = await useSafeBody(event, Schema)

  return db.update(SystemSettingSchema)
    .set(data)
    .where(eq(SystemSettingSchema.id, id))
    .returning()
})
