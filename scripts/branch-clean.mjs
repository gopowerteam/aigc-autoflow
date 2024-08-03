#!/usr/bin/env zx
import readline from 'node:readline'
import process from 'node:process'

const { stdout: branch } = await $`git branch --show-current`
const { stdout: branchs } = await $`git branch -l`
const { stdout: username } = await $`git config user.name`

if (branch.trim() !== 'master') {
  console.log('请在[master]分支上执行操作')
  process.exit(1)
}

const list = branchs
  .replace(/\*/g, '')
  .split('\n')
  .map(x => x.trim())
  .filter(Boolean)
  .filter(x => x.startsWith(username.trim()))

const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

if (!list.length) {
  console.log('未发现可以删除的分支.')
  process.exit(1)
}

prompt.question(`是否删除由自己创建的${list.length}个分支? (Y/n) \n${list.join('\n')}`, async (answer) => {
  // deleteMyBranchs()
  if (['y', 'Y', 'yes', ''].includes(answer.trim())) {
    await deleteMyBranchs()
  }
  prompt.pause()
})

function deleteMyBranchs() {
  list.forEach(async (branch) => {
    await $`git branch -D ${branch}`
  })
  console.log('删除完成')
}
