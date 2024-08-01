import { drizzle } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

const runtimeConfig = useRuntimeConfig()

const client = new Client(runtimeConfig.database)
await client.connect()

export const db = drizzle(client)
