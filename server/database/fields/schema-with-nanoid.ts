import { nanoid } from 'nanoid'
import * as pg from 'drizzle-orm/pg-core'

export function SchemaWithNanoID<T>(columns: T) {
  return {
    id: pg.varchar('id').primaryKey().$defaultFn(() => nanoid()),
    ...columns,
  }
}

export const SchemaWithID = SchemaWithNanoID
