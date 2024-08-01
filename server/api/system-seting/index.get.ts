import { asc } from 'drizzle-orm'
import { SystemSettingSchema } from '~/drizzle/schemas'

export default defineEventHandler(async () => {
  return db.query.SystemSettingSchema.findMany({
    orderBy: [asc(SystemSettingSchema.key)],
  })
})
