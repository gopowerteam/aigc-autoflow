import type { H3Event } from 'h3'
import jwt from 'jsonwebtoken'

function getAccessTokenByHeader(event: H3Event) {
  const authorization = event.headers.get('Authorization')

  if (authorization) {
    return authorization.replace('Bearer', '').trim()
  }
}

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api')) {
    return
  }

  const token = getAccessTokenByHeader(event)
  if (!token) {
    return
  }

  try {
    const payload = jwt.decode(token) as jwt.JwtPayload

    if (!payload || !payload?.id) {
      return
    }

    // user id for user entity
    event.context.user = payload?.id
  }
  catch (ex) {
    console.error(ex)
  }
})
