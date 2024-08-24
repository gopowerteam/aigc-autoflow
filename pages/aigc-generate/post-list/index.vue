<script setup lang="tsx">
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import { FormRender } from '@gopowerteam/form-render'
import { SystemSettingFieldsDict } from '@/config/dict.config'
import type { Post } from '@/drizzle/schemas'

definePageMeta({
  layout: 'workspace',
  title: '文章列表',
  requireAuth: true,
  menu: {
    key: 'post-list',
    path: ['aigc-generate'],
    index: 2,
  },
})

const table = useTable('table')

const columns = defineColumns<Post>([{
  key: 'title',
  title: '文章标题',
}, {
  key: 'tags',
  title: '文章标签',
  render: r => r.tag({
    formatter: r => r.tags || [],
  }),
}, {
  key: 'length',
  title: '字数',
  render: r => r.text(record => record.content.length),
}, {
  key: 'content',
  title: '内容',
  collapsed: true,
}, {
  key: 'createdAt',
  title: '修改时间',
  render: r => r.date(),
}, {
  key: 'updatedAt',
  title: '更新时间',
  render: r => r.date(),
}, {
  key: 'action',
  title: '操作',
  render: r => r.button([
    {
      content: '查看',
      onClick(record) {
        table.value.preview({
          key: record.id,
          record,
          title: record.title,
        })
      },
    },
    {
      content: '删除',
      onClick(record) {
        return requestDelete(record)
      },
    },
  ],
  ),
}])

// async function requestGenerate(record: Post) {
//   await $request('/api/post/generate', {
//     body: {
//       id: record.id,
//     },
//   })

//   Message.success('生成成功')
//   setTimeout(() => {
//     navigateTo({
//       path: '/aigc-generate/post-info',
//       query: {
//         id: record.id,
//       },
//     })
//   }, 1000)
// }

async function requestDelete(record: Post) {
  await $request(`/api/post/${record.id}`, { method: 'DELETE' })

  Message.success('已删除')
}

const onTableLoad = defineTableLoad(async ({ update }) => {
  const data = await $request('/api/post', { method: 'GET' })
  update(data)
})
</script>

<template>
  <PageContainer>
    <template #actions>
      <a-button type="primary" @click="() => navigateTo('/aigc-generate/post-create')">
        新建文章
      </a-button>
    </template>
    <TableRender ref="table" :columns="columns" :data-load="onTableLoad" row-key="id" />
  </PageContainer>
</template>
