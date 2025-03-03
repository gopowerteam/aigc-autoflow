import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import { getTableName, sql } from 'drizzle-orm'

import { SystemSettingFieldsEnum, SystemSettingSchema, SystemSettingScopesEnum } from '../schemas'

type TX = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

export async function runSystemSettingSeed(tx: TX) {
  // Clear Table Data
  await tx.execute(sql.raw(`TRUNCATE TABLE ${getTableName(SystemSettingSchema)}`))

  // Insert Table Data
  await tx.insert(SystemSettingSchema).values([
    // Global
    {
      key: SystemSettingFieldsEnum.AdminUsername,
      value: 'admin',
      scope: SystemSettingScopesEnum.Global,
    },
    {
      key: SystemSettingFieldsEnum.AdminPassword,
      value: '123456',
      scope: SystemSettingScopesEnum.Global,
    },
    {
      key: SystemSettingFieldsEnum.AIApiURL,
      value: '__api_url__',
      scope: SystemSettingScopesEnum.Global,
    },
    {
      key: SystemSettingFieldsEnum.AIApiKey,
      value: '__api_key__',
      scope: SystemSettingScopesEnum.Global,
    },
    // AigcEnglish
    {
      key: SystemSettingFieldsEnum.AigcEnglishModel,
      value: 'gpt-4o-mini',
      scope: SystemSettingScopesEnum.AigcEnglish,
    },
    {
      key: SystemSettingFieldsEnum.AigcEnglishPrompt,
      value: 'test',
      scope: SystemSettingScopesEnum.AigcEnglish,
    },
  ])
}
