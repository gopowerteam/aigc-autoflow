<script lang="tsx" setup>
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import type { Prompt } from '@/drizzle/schemas'

definePageMeta({
  layout: 'workspace',
  title: '提示词管理',
  requireAuth: true,
  menu: {
    key: 'prompt',
    path: ['aigc-generate'],
    index: 1,
  },
})

const columns = defineColumns<Prompt>([{
  key: 'tag',
  title: '内容标签',
  render: r => r.tag({
    formatter: r => [r.tag],
  }),
}, {
  key: 'template',
  title: '状态',
  render: r => r.text(),
}, {
  key: 'createdAt',
  title: '创建时间',
  render: r => r.date(),
}, {
  key: 'updatedAt',
  title: '修改时间',
  render: r => r.date(),
}, {
  key: 'action',
  title: '操作',
  render: r => r.button([{
    content: '更新',
    // onClick(record) {
    //   // return requestUpdateTask(record)
    // },
  }]),
}])

const onTableLoad = defineTableLoad(async ({ update }) => {
  const data = await $request('/api/prompt', { method: 'GET' })
  update(data)
})
</script>

<template>
  <section>
    <TableRender :columns="columns" :data-load="onTableLoad" row-key="id" />
  </section>
</template>

<style lang="less" scoped></style>
