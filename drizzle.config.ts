import { defineConfig } from 'drizzle-kit'
import { runtimeConfig } from './runtime.config'

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/database/schema/index.ts',
  out: './server/database/migrations',
  dbCredentials: runtimeConfig.database,
})
