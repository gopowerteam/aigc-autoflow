import type { ExtractTablesWithRelations } from 'drizzle-orm'
import { getTableName, sql } from 'drizzle-orm'
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type { PgTransaction } from 'drizzle-orm/pg-core'

import { SystemSettingFieldsEnum, SystemSettingSchema } from '../schemas'

type TX = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

export async function runSystemSettingSeed(tx: TX) {
  // Clear Table Data
  await tx.execute(sql.raw(`TRUNCATE TABLE ${getTableName(SystemSettingSchema)}`))

  // Insert Table Data
  await tx.insert(SystemSettingSchema).values([
    {
      key: SystemSettingFieldsEnum.AdminUsername,
      value: 'admin',
    },
    {
      key: SystemSettingFieldsEnum.AdminPassword,
      value: '123456',
    },
    {
      key: SystemSettingFieldsEnum.AIApiURL,
      value: '__api_url__',
    },
    {
      key: SystemSettingFieldsEnum.AIApiKey,
      value: '__api_key__',
    },
  ])
}
