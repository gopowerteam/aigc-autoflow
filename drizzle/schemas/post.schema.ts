import { pgTable, text } from 'drizzle-orm/pg-core'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'

export const PostSchema = pgTable('post', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  title: text('title').notNull(),
  content: text('content').notNull(),
  tags: text('tags').array(),
}))

export type Post = typeof PostSchema.$inferSelect
export type PostInsert = typeof PostSchema.$inferInsert
