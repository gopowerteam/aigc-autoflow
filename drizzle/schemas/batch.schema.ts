import { relations } from 'drizzle-orm'
import { boolean, pgTable } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { SchemaWithID, SchemaWithTime } from '../fields'
import { pipe } from '../utils/pipe'
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

export type Batch = InferSchemaType<'BatchSchema', { tasks: true }>

export const CreateBatchSchema = createInsertSchema(BatchSchema)
export const SelectBatchSchema = createSelectSchema(BatchSchema)
