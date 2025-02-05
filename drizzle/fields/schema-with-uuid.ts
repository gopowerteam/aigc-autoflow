import { sql } from 'drizzle-orm'
import * as pg from 'drizzle-orm/pg-core'

export function SchemaWithUUID<T>(columns: T) {
  return {
    id: pg.varchar('id').primaryKey().$default(() => sql`gen_random_uuid()`),
    ...columns,
  }
}
