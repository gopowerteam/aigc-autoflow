<script lang="tsx" setup>
import type { Prompt } from '@/drizzle/schemas'
import { FormRender } from '@gopowerteam/form-render'
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'

const table = useTable('table')
const form = defineForm<Prompt>([
  {
    key: 'tag',
    title: '标签',
    rule: [{ required: true, message: '请输入标签名称' }],
    render: r => r.input(),
  },
  {
    key: 'template',
    title: '模板内容',
    rule: [{ required: true, message: '请输入模板内容' }],
    render: r => r.textarea({
      autosize: {
        minRows: 10,
        maxRows: 20,
      },
    }),
  },
])

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
    content: '编辑',
    async onClick(record) {
      const data = await table.value.edit({
        record,
        form,
      })

      await $request(`/api/prompt/:id`, {
        params: {
          id: record.id,
        },
        method: 'PUT',
        body: data,
      })

      Message.success('更新成功')
    },
  }, {
    content: '删除',
    confirm: true,
    async onClick(record) {
      await $request(`/api/prompt/:id`, {
        params: {
          id: record.id,
        },
        method: 'DELETE',
      })

      Message.success('更新成功')
    },
  }]),
}])

const onTableLoad = defineTableLoad(async ({ update }) => {
  const data = await $request('/api/prompt', { method: 'GET' })
  update(data)
})

const modal = useModal()

function onAddClick() {
  const { close } = modal.open(FormRender, {
    form,
    submitable: true,
    onSubmit: async (data: any) => {
      await $request('/api/prompt', {
        method: 'POST',
        body: data,
      })
      close()
      Message.success('增加成功')
      table.value.reload()
    },
    onCancel: () => {
      close()
    },
  }, {
    title: '新规则信息',
    size: 'small',
  })
}
</script>

<template>
  <PageContainer>
    <template #actions>
      <AButton type="primary" @click="onAddClick">
        增加规则
      </AButton>
    </template>
    <TableRender ref="table" :columns="columns" :data-load="onTableLoad" row-key="id" />
  </PageContainer>
</template>

<style lang="less" scoped></style>
