import process from 'node:process'
import pg from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { sql } from 'drizzle-orm'
import { runtimeConfig } from '../../runtime.config'
import * as schema from '../schemas'

async function createDB() {
  const client = new pg.Client(runtimeConfig.database)
  await client.connect()

  return drizzle(client, { schema })
}

async function reset() {
  const db = await createDB()
  const tableSchema = db._.schema
  if (!tableSchema) {
    throw new Error('No table schema found')
  }

  // console.log('🗑️  Emptying the entire database')
  const queries = Object.values(tableSchema).map((table) => {
    // console.log(`🧨 Preparing delete query for table: ${table.dbName}`)
    return sql.raw(`TRUNCATE TABLE ${table.dbName};`)
  })

  // console.log('📨 Sending delete queries...')

  await db.transaction(async (tx) => {
    await Promise.all(
      queries.map(async (query) => {
        if (query)
          await tx.execute(query)
      }),
    )
  })

  // console.log('✅ Database emptied')
}

reset().then(() => {
  process.exit(1)
}).catch((e) => {
  console.error(e)
})
