import { asc } from 'drizzle-orm'
import { SystemSettingSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async () => {
  return db.query.SystemSettingSchema.findMany({
    orderBy: [asc(SystemSettingSchema.key)],
  })
})
