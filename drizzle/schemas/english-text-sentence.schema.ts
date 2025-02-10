import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'
import { EnglishTextSchema } from './english-text.schema'

export const EnglishTextSentenceSchema = pgTable('english_text_sentence', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  textId: text('text_id').notNull(),
  english: text('english').notNull(),
  chinese: text('chinese').notNull(),
  audio: text('audio').notNull(),
}))

export const TaskRelations = relations(EnglishTextSentenceSchema, ({ one }) => ({
  text: one(EnglishTextSchema, {
    fields: [EnglishTextSentenceSchema.textId],
    references: [EnglishTextSchema.id],
  }),
}))

export type EnglishTextSentence = typeof EnglishTextSentenceSchema.$inferSelect
export type EnglishTextSentenceInsert = typeof EnglishTextSentenceSchema.$inferInsert
