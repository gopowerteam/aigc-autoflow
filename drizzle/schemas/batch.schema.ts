import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { pipe } from '../utils/pipe'
import { SchemaWithID, SchemaWithTime } from '../fields'
import type { InferResultType } from '../utils/infer-result-type.js'
import { TaskSchema } from './task.schema'

export const BatchSchema = pgTable('batch', pipe(
  SchemaWithID,
  SchemaWithTime,
)({
  completed: boolean('completed').default(false),
}))

export const BatchRelations = relations(BatchSchema, ({ many }) => ({
  tasks: many(TaskSchema),
}))

// export type Batch = typeof BatchSchema.$inferSelect

export type Batch = InferResultType<'BatchSchema', { tasks: true }>

export const CreateBatchSchema = createInsertSchema(BatchSchema)
export const SelectBatchSchema = createSelectSchema(BatchSchema)
