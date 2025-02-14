export function useQiniu() {
  async function upload(file: File): Promise<string> {
    const { key, url, token } = await $request('/api/qiniu/token')

    const formData = new FormData()
    formData.append('file', file) // 上传的文件
    formData.append('token', token) // 上传凭证
    formData.append('key', key) // 上传凭证

    // 使用 fetch 上传文件
    return new Promise((resolve, reject) => {
      fetch('https://up-z2.qiniup.com/', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(() => {
          resolve(url)
        })
        .catch((error) => {
          console.error('上传失败:', error)
          reject(error)
        })
    })
  }

  return {
    upload,
  }
}
