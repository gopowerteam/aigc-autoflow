import { pgTable, text } from 'drizzle-orm/pg-core'
import { pipe } from '../utils/pipe'
import { SchemaWithID, SchemaWithTime } from '../fields'

export const PromptSchema = pgTable('prompt', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  template: text('template').notNull(),
  tag: text('tag').unique().notNull(),
}))

export type Prompt = typeof PromptSchema.$inferSelect
