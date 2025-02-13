import { nanoid } from 'nanoid'
import qiniu from 'qiniu'

export default defineEventHandler(async (event) => {
  // 从环境变量获取密钥
  const { qiniu: {
    accessToken,
    secretToken,
    bucket,
    domain,
  } } = useRuntimeConfig()

  if (!accessToken || !secretToken) {
    throw createError({
      statusCode: 500,
      message: '七牛云配置缺失',
    })
  }

  // 生成文件key
  const key = `aigc/${nanoid()}`
  const scope = `${bucket}:${key}`
  const url = `${domain}/${key}`
  // 初始化认证对象
  const mac = new qiniu.auth.digest.Mac(accessToken, secretToken)

  // 配置上传策略
  const putPolicy = new qiniu.rs.PutPolicy({
    scope,
    expires: 7200, // token 有效期 2 小时
  })

  // 生成上传 token
  const uploadToken = putPolicy.uploadToken(mac)

  return {
    token: uploadToken,
    expires: 7200,
    key,
    url,
  }
})
