<script setup lang="tsx">
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import { Input } from '@arco-design/web-vue'
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
      content: '生成',
      onClick(record) {
        return requestGenerate(record)
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

async function requestGenerate(record: Post) {
  await $request('/api/post/generate', {
    body: {
      id: record.id,
    },
  })

  Message.success('生成成功')
  setTimeout(() => {
    navigateTo({
      path: '/aigc-generate/post-info',
      query: {
        id: record.id,
      },
    })
  }, 1000)
}

async function requestDelete(record: Post) {
  await $request(`/api/post/${record.id}`, { method: 'DELETE' })

  Message.success('已删除')
}

const onTableLoad = defineTableLoad(async ({ update }) => {
  // const data = await $request('/api/post', { method: 'GET' })
  const data = [
    {
      id: '123',
      createdAt: '2024-05-10 12:01:32',
      updatedAt: '2024-05-10 12:01:32',
      title: '天空中出现这道光的时候必定会？',
      content: 'balabala,balabala,balabala,balabala,balabala,balabala',
      tags: ['奇异事件', '八卦'],
    },
  ]
  update(data)
})

function toCreate() {
  navigateTo({
    path: '/aigc-generate/post-create',
  })
}
</script>

<template>
  <section>
    <div class="mb-4 text-right">
      <a-button type="primary" class="mb-4" @click="toCreate">
        新建文章
      </a-button>
      <TableRender :columns="columns" :data-load="onTableLoad" row-key="id" />
    </div>
  </section>
</template>
