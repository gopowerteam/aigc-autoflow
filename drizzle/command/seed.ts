import process from 'node:process'
import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { runtimeConfig } from '../../runtime.config'
import * as seeds from '../seeds'

async function createDB() {
  const client = new pg.Client(runtimeConfig.database)
  await client.connect()

  return drizzle(client)
}

async function seed() {
  const db = await createDB()

  await db.transaction(async (tx) => {
    await Promise.all(
      Object.values(seeds).map(run => run(tx)),
    )
  })
}

seed().then(() => {
  process.exit(1)
}).catch((e) => {
  console.error(e)
})
