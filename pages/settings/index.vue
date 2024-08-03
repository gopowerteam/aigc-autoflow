<script lang="tsx" setup>
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import { Input } from '@arco-design/web-vue'
import { SystemSettingFieldsDict } from '@/config/dict.config'
import type { SystemSetting } from '@/drizzle/schemas'

const columns = defineColumns<SystemSetting>([{
  key: 'key',
  title: '名称',
  render: r => r.dict(SystemSettingFieldsDict),
}, {
  key: 'value',
  title: '值',
  render: r => r.render(record => <Input v-model={record.value}></Input>),
}, {
  key: 'action',
  title: '操作',
  render: r => r.button([{
    content: '更新',
    onClick(record) {
      return requestUpdateSetting(record)
    },
  }]),
}])

async function requestUpdateSetting(record: { key: string, value: string }) {
  await $request('', {
    method: 'PUT',
    body: {
      key: record.key,
      value: record.value,
    },
  })

  Message.success('更新成功')
}

const onTableLoad = defineTableLoad(async ({ update }) => {
  const data = await $request('/api/system-setting', { method: 'GET' })
  update(data)
})

definePageMeta({
  layout: 'workspace',
  title: '系统设置',
  menu: {
    key: 'system-setting',
    index: 10,
  },
  requireAuth: true,
})
</script>

<template>
  <div>
    <TableRender :columns="columns" :data-load="onTableLoad" row-key="id" />
  </div>
</template>

<style scoped></style>
