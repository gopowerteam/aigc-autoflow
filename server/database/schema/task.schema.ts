import { boolean, pgTable, text } from 'drizzle-orm/pg-core'

export const TaskSchema = pgTable('task', {
  completed: boolean('completed').default(false),
})

export type Task = typeof TaskSchema.$inferSelect
