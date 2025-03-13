import type { Buffer } from 'node:buffer'
import { nanoid } from 'nanoid'
import qiniu from 'qiniu'

// 从环境变量获取密钥
const { qiniu: qiniuConf } = useRuntimeConfig()

class Qiniu {
  async generateToken() {
    if (!qiniuConf.accessToken || !qiniuConf.secretToken) {
      throw createError({
        statusCode: 500,
        message: '七牛云配置缺失',
      })
    }

    const { qiniu: { accessToken, secretToken } } = useRuntimeConfig()
    const bucket = qiniuConf.bucket
    const key = `aigc/${nanoid()}`
    const scope = `${bucket}:${key}`
    const url = `${qiniuConf.domain}/${key}`

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
  }

  async upload(buffer: Buffer<ArrayBufferLike>): Promise<string> {
    const { token, key, url } = await this.generateToken()

    const formUploader = new qiniu.form_up.FormUploader()
    const putExtra = new qiniu.form_up.PutExtra()

    await formUploader
      .put(token, key, buffer, putExtra)
      .then(({ resp }) => {
        if (resp.statusCode !== 200) {
          throw new Error(`Upload failed with status code: ${resp.statusCode}`)
        }
      })

    return url
  }
}

export function useQiniu() {
  return new Qiniu()
}
