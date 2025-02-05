// model SystemSetting {
//   id        String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
//   key       SystemSettingFields @unique
//   value     String
//   createdAt DateTime            @default(now())
//   updatedAt DateTime            @default(now()) @updatedAt
// }

import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'
import { toPgEnum } from '../utils/to-pg-enum'

export enum SystemSettingFieldsEnum {
  AdminUsername = 'AdminUsername',
  AdminPassword = 'AdminPassword',
  AIApiURL = 'AIApiURL',
  AIApiKey = 'AIApiKey',
}

const SystemSettingFields = pgEnum('system_setting_fields', toPgEnum(SystemSettingFieldsEnum))

export const SystemSettingSchema = pgTable('system_setting', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  key: SystemSettingFields('key').unique().notNull(),
  value: text('value').notNull(),
}))

export type SystemSetting = typeof SystemSettingSchema.$inferSelect
export type SystemSettingInsert = typeof SystemSettingSchema.$inferInsert
