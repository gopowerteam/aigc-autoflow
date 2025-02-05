import type { SignOptions } from 'jsonwebtoken'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
import { REDIS_REFRESH_TOKEN } from '~/config/constant.config'

export function createUserToken(id: string) {
  const { auth } = useRuntimeConfig()

  const createJwtToken = (secret: string, expiresIn: string) => {
    return jwt.sign(
      { id },
      secret,
      {
        expiresIn,
      } as SignOptions,
    )
  }

  const accessTokenExpires = auth.accessToken.expires
  const refreshTokenExpires = auth.refreshToken.expires

  const accessTokenExpiresUnix = dayjs().add(Number(accessTokenExpires.slice(0, -1)), accessTokenExpires.slice(-1) as dayjs.UnitTypeShort).unix()
  const refreshTokenExpiresUnix = dayjs().add(Number(refreshTokenExpires.slice(0, -1)), refreshTokenExpires.slice(-1) as dayjs.UnitTypeShort).unix()

  const accessToken = createJwtToken(auth.accessToken.secret, accessTokenExpires)
  const refreshToken = createJwtToken(auth.refreshToken.secret, refreshTokenExpires)

  useStorage('redis').setItem(`${REDIS_REFRESH_TOKEN}:${refreshToken}`, id, {
    ttl: refreshTokenExpiresUnix,
  })

  return {
    accessToken,
    refreshToken,
    expires: accessTokenExpiresUnix * 1000,
  }
}
