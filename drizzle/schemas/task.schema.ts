import { relations } from 'drizzle-orm'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'
import { PromptSchema } from './prompt.schema'
import { BatchSchema } from './batch.schema'

export const TaskSchema = pgTable('task', pipe(
  SchemaWithID,
  SchemaWithTime,
)(
  {
    title: text('title'),
    input: text('input'),
    promptId: text('prompt_id'),
    batchId: text('batch_id'),
    completed: boolean('completed').default(false),
  },
))

export const TaskRelations = relations(TaskSchema, ({ one }) => ({
  prompt: one(PromptSchema, {
    fields: [TaskSchema.promptId],
    references: [PromptSchema.id],
  }),
  batch: one(BatchSchema, {
    fields: [TaskSchema.batchId],
    references: [BatchSchema.id],
  }),
}))

export type Task = typeof TaskSchema.$inferSelect
