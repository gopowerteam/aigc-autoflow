import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'
import { AigcEnglishSentenceSchema } from './aigc-english-sentence.schema'

export const AigcEnglishContentSchema = pgTable('aigc_english_content', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  topic: text('topic').notNull(),
  audio: text('audio').notNull(),
  titleEnglish: text('title_english').notNull(),
  titleChinese: text('title_chinese').notNull(),
}))

export const AigcEnglishContentRelations = relations(AigcEnglishContentSchema, ({ many }) => ({
  sentences: many(AigcEnglishSentenceSchema),
}))

export type AigcEnglishContentInsert = typeof AigcEnglishContentSchema.$inferInsert



export type AigcEnglishContent = InferSchemaType<'AigcEnglishContentSchema', 
{ 
  sentences: true 
}>
