import process from 'node:process'

export const runtimeConfig = {
  database: {
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    ssl: false,
  },
  auth: {
    accessToken: {
      secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRES_IN,
    },
    refreshToken: {
      secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    },
  },
} as const
