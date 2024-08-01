// model SystemSetting {
//   id        String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   key       SystemSettingFields @unique
//   value     String
//   createdAt DateTime            @default(now())
//   updatedAt DateTime            @default(now()) @updatedAt
// }

import { boolean, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { pipe } from '../utils/pipe'
import { SchemaWithID, SchemaWithTime } from '../fields'

export const SystemSettingFieldsEnum = pgEnum('system_setting_fields', [
  'AdminUsername',
  'AdminPassword',
  'AIApiURL',
  'AIApiKey',
])

export const SystemSettingSchema = pgTable('system_setting', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  key: SystemSettingFieldsEnum('key').unique().notNull(),
  value: text('value').notNull(),
}))

export type SystemSetting = typeof SystemSettingSchema.$inferSelect
export type SystemSettingInsert = typeof SystemSettingSchema.$inferInsert
