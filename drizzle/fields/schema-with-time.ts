import { sql } from 'drizzle-orm'
import * as pg from 'drizzle-orm/pg-core'

/**
 * createdAt
 */
export const createdAt = pg.timestamp('createdAt', { withTimezone: true, mode: 'string' }).defaultNow().notNull()

/**
 * updatedAt
 */
export const updatedAt = pg.timestamp('updatedAt', { withTimezone: true, mode: 'string' }).defaultNow().$onUpdate(() => sql`now()`).notNull()

export function SchemaWithTime<T>(columns: T) {
  return {
    createdAt,
    updatedAt,
    ...columns,
  }
}
