import { asc } from 'drizzle-orm'
import { SystemSettingSchema } from '~/drizzle/schema'

export default defineEventHandler(async () => {
  return db.query.SystemSettingSchema.findMany({
    orderBy: [asc(SystemSettingSchema.key)],
  })
})
