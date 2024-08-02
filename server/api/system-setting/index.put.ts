import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { SystemSettingSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const Schema = createInsertSchema(SystemSettingSchema)

export default defineAuthEventHandler(async (event) => {
  const data = await useSafeBody(event, Schema)

  return db.update(SystemSettingSchema)
    .set(data)
    .where(eq(SystemSettingSchema.key, data.key))
    .returning()
})
