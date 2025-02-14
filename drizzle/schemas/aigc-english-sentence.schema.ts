import { relations } from 'drizzle-orm'
import { pgTable, real, text } from 'drizzle-orm/pg-core'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'
import { AigcEnglishContentSchema } from './aigc-english-content.schema'

export const AigcEnglishSentenceSchema = pgTable('aigc_english_sentence', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  textId: text('text_id').notNull(),
  english: text('english').notNull(),
  chinese: text('chinese').notNull(),
  audioDuration: real('audio_duration').notNull(),
}))

export const AigcEnglishSentenceRelations = relations(AigcEnglishSentenceSchema, ({ one }) => ({
  text: one(AigcEnglishContentSchema, {
    fields: [AigcEnglishSentenceSchema.textId],
    references: [AigcEnglishContentSchema.id],
  }),
}))

export type AigcEnglishSentence = typeof AigcEnglishSentenceSchema.$inferSelect
export type AigcEnglishSentenceInsert = typeof AigcEnglishSentenceSchema.$inferInsert
