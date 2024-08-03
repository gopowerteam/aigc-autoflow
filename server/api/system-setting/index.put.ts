import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import { SystemSettingSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = createInsertSchema(SystemSettingSchema)

export default defineAuthEventHandler(async (event) => {
  const data = await useSafeBody(event, BodySchema)

  return db.update(SystemSettingSchema)
    .set(data)
    .where(eq(SystemSettingSchema.key, data.key))
    .returning()
})
