import type { ExtractTablesWithRelations } from 'drizzle-orm'
import { getTableName, sql } from 'drizzle-orm'
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type { PgTransaction } from 'drizzle-orm/pg-core'

import { SystemSettingSchema } from '../schemas'

type TX = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

export async function useSystemSettingSeed(tx: TX) {
  // Clear Table Data
  await tx.execute(sql.raw(`TRUNCATE TABLE ${getTableName(SystemSettingSchema)}`))

  // Insert Table Data
  await tx.insert(SystemSettingSchema).values([
    {
      key: 'AdminUsername',
      value: 'admin',
    },
    {
      key: 'AdminPassword',
      value: '123456',
    },
    {
      key: 'AIApiURL',
      value: '__api_url__',
    },
    {
      key: 'AIApiKey',
      value: '__api_key__',
    },
  ])
}
