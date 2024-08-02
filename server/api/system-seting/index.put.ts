import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { SystemSettingSchema } from '~/drizzle/schemas'

const Schema = createInsertSchema(SystemSettingSchema)

export default defineEventHandler(async (event) => {
  const data = await useSafeBody(event, Schema)

  return db.update(SystemSettingSchema)
    .set(data)
    .where(eq(SystemSettingSchema.key, data.key))
    .returning()
})
