import type { JwtPayload } from 'jsonwebtoken'
import { z } from 'h3-zod'
import jwt from 'jsonwebtoken'
import { REDIS_REFRESH_TOKEN } from '~/config/constant.config'

const Schema = z.object({
  token: z.string(),
})

export default defineEventHandler(async (event) => {
  const { token } = await useSafeQuery(event, Schema)
  const payload = jwt.decode(token) as JwtPayload
  const isExist = await useStorage('redis').hasItem(`${REDIS_REFRESH_TOKEN}:${token}`)

  if (!payload.id || !isExist) {
    throw createError({
      status: 404,
      statusMessage: 'Not Found Paylod',
      fatal: false,
    })
  }

  await useStorage('redis').removeItem(`${REDIS_REFRESH_TOKEN}:${token}`)

  return createUserToken(payload.id)
})
