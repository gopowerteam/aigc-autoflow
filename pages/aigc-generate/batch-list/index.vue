<script setup lang="tsx">
import type { Batch } from '@/drizzle/schemas'
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'

definePageMeta({
  layout: 'workspace',
  title: '批次管理',
  requireAuth: true,
  name: 'batch-list',
  menu: {
    key: 'batch-list',
    path: ['aigc-generate'],
    index: 3,
  },
})

function onCreate() {
  navigateTo('/aigc-generate/batch-create')
}

const columns = defineColumns<Batch>([{
  key: 'id',
  title: '批次ID',
}, {
  key: 'tasks',
  title: '任务数',
  render: r => r.text(record => record.tasks.length),
}, {
  key: 'createdAt',
  title: '创建时间',
  render: r => r.date(),
}, {
  key: 'updatedAt',
  title: '修改时间',
  render: r => r.date(),
}, {
  key: 'completed',
  title: '状态',
  render: r => r.dict(ComplatedDict),
}])

const onTableLoad = defineTableLoad(async ({ update }) => {
  return $request('/api/batch', { method: 'GET' }).then((data) => {
    update(data)
  })
})
</script>

<template>
  <PageContainer>
    <template #actions>
      <AButton type="primary" @click="onCreate">
        新建批次
      </AButton>
    </template>
    <TableRender :columns="columns" :data-load="onTableLoad" row-key="id" />
  </PageContainer>
</template>
