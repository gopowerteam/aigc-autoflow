#!/usr/bin/env zx
import process from 'node:process'
import { customAlphabet } from 'nanoid'
import dayjs from 'dayjs'

const nanoid = customAlphabet('1234567890abcdef', 5)

const { stdout: branch } = await $`git branch --show-current`
const { stdout: username } = await $`git config user.name`
console.log(branch, username)

if (branch.trim() !== 'master') {
  console.log('请在[master]分支上创建其他分支')
  process.exit(1)
}

const branchName = `${username.trim()}-${dayjs().format('YYYYMMDD')}-${nanoid()}`

if (branchName) {
  await $`git branch ${branchName}`
  await $`git checkout ${branchName}`
  console.log(`分支创建成功: ${branchName}`)
}
