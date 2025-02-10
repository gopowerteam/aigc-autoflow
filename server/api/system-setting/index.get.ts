import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { SystemSettingSchema, SystemSettingScopesEnum } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const QuerySchema = z.object({
  scope: z.nativeEnum(SystemSettingScopesEnum),
})

export default defineAuthEventHandler(async (event) => {
  const query = await useSafeQuery(event, QuerySchema)

  return db.query.SystemSettingSchema.findMany({
    where: eq(SystemSettingSchema.scope, query.scope),
    orderBy: [asc(SystemSettingSchema.key)],
  })
})
