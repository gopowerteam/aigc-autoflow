import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'
import { EnglishTextSentenceSchema } from './english-text-sentence.schema'

export const EnglishTextSchema = pgTable('english_text', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  title: text('title').notNull(),
  content: text('content').notNull(),
  image: text('image'),
  tags: text('tags').array(),
}))

export const BatchRelations = relations(EnglishTextSchema, ({ many }) => ({
  sentences: many(EnglishTextSentenceSchema),
}))

export type EnglishText = typeof EnglishTextSchema.$inferSelect
export type EnglishTextInsert = typeof EnglishTextSchema.$inferInsert
