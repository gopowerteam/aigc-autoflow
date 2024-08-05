<script setup lang="tsx">
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import { Input } from '@arco-design/web-vue'
import { SystemSettingFieldsDict } from '@/config/dict.config'
import type { Batch } from '@/drizzle/schemas'

definePageMeta({
  layout: 'workspace',
  title: '批次管理',
  requireAuth: true,
  name: 'batch-list',
  // menu: {
  //   path: ['aigc-generate'],
  //   index: 1,
  // },
})

function toCreate() {
  navigateTo({
    path: '/aigc-generate/batch-create',
  })
}

const columns = defineColumns<Batch>([{
  key: 'tasks',
  title: '任务名称',
  render: r => r.render(record => <Input v-model={record.tasks}></Input>),
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
  render: r => r.text(),
}, {
  key: 'action',
  title: '操作',
  render: r => r.button([{
    content: '更新',
    onClick(record) {
      return requestUpdateTask(record)
    },
  }]),
}])

async function requestUpdateTask(record: Batch) {
  // await $request(`/api/prompt/${record.id}`, {
  //   method: 'PUT',
  //   body: {
  //     id: record.id,
  //     tasks: record.tasks!,
  //   },
  // })

  // Message.success('更新成功')
}

const onTableLoad = defineTableLoad(async ({ update }) => {
  const data = await $request('/api/prompt', { method: 'GET' })
  update(data)
})
</script>

<template>
  <section>
    <div class="mb-4 text-right">
      <a-button type="primary" class="mb-4" @click="toCreate">
        新建批次
      </a-button>
      <TableRender :columns="columns" :data-load="onTableLoad" row-key="id" />
    </div>
  </section>
</template>
