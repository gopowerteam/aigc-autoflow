import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

export function getRootPath() {
  let current = path.dirname(url.fileURLToPath(import.meta.url))

  while (!fs.readdirSync(current).includes('package.json')) {
    current = path.resolve(current, '..')
  }

  return current
}
