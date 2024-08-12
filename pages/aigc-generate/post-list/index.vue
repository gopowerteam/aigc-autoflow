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

const postTable = ref(null)

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
  const data = await $request('/api/post', { method: 'GET' })
  update(data)
})

const modal = useModal()

const form2 = defineForm<Post>([
  {
    key: 'title',
    title: '文章标题',
    rule: [{ required: true, message: '请输入文章标题' }],
    render: r => r.input(),
  },
  {
    key: 'tag',
    title: '标签',
    rule: [{ required: true, message: '请选择关键词标签' }],
    render: r => r.select({
      multiple: true,
      options: async () => {
        const data = await $request('/api/prompt/tags', { method: 'get' })
        const map = new Map()
        data.tags.forEach((item) => {
          map.set(item, item)
        })
        return map
      },
    }),
  },
])

function toCreate() {
  modal.open(() => <FormRender form={form2} layout="vertical" submitable={true}></FormRender>, {
    onSubmit: async (data: Post) => {
      await $request('/api/post', {
        method: 'post',
        body: data,
      })
      modal.close()
      Message.success('增加成功')
      postTable.value.reload()
    },
    onCancel: modal.close,
  }, {
    title: '新增文章规则',
    size: 'small',
  })
}
</script>

<template>
  <section>
    <div class="mb-4 text-right">
      <a-button type="primary" class="mb-4" @click="toCreate">
        新建文章
      </a-button>
      <TableRender ref="postTable" :columns="columns" :data-load="onTableLoad" row-key="id" />
    </div>
  </section>
</template>
