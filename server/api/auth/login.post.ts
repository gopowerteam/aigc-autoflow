import { and, eq } from 'drizzle-orm'
import { z } from 'h3-zod'
import { SystemSettingFieldsEnum, SystemSettingSchema } from '~/drizzle/schemas'
import { useSafeBody } from '~/server/utils/use-safe-validate'

const Schema = z.object({
  username: z.string(),
  password: z.string(),
})

export default defineEventHandler(async (event) => {
  const { username, password } = await useSafeBody(event, Schema)

  const isUsernameExist = await db.query.SystemSettingSchema.findFirst({
    where: and(
      eq(SystemSettingSchema.key, SystemSettingFieldsEnum.AdminUsername),
      eq(SystemSettingSchema.value, username),
    ),
  })

  const isPasswrodExist = await db.query.SystemSettingSchema.findFirst({
    where: and(
      eq(SystemSettingSchema.key, SystemSettingFieldsEnum.AdminPassword),
      eq(SystemSettingSchema.value, password),
    ),
  })

  if (!isUsernameExist || !isPasswrodExist) {
    throw createError({
      statusCode: 401,
      statusMessage: '登录失败, 用户名或密码错误',
    })
  }

  return createUserToken(username)
})
