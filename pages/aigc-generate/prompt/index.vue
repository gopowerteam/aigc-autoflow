<script lang="tsx" setup>
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import { FormRender } from '@gopowerteam/form-render'
import type { Prompt } from '@/drizzle/schemas'

const promptTable = ref(null)
const form2 = defineForm<Prompt>([
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
    render: r => r.textarea(),
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
    onClick(record) {
      // 错误的useTable，需要使用ref
      promptTable.value.edit({
        record,
        form: form2,
      }).then(async (data) => {
        await $request(`/api/prompt/${record.id}`, {
          method: 'PUT',
          body: data,
        })
        Message.success('更新成功')
      })
    },
  }, {
    content: '删除',
    onClick(record) {
      // ?
      // await $request(`/api/prompt`, {

      // })
      // Message.success('更新成功')
    },
  }]),
}])

const onTableLoad = defineTableLoad(async ({ update }) => {
  const data = await $request('/api/prompt', { method: 'GET' })
  update(data)
})

const modal = useModal()

function onAddClick() {
  modal.open(() => <FormRender form={form2} layout="vertical" submitable={true}></FormRender>, {
    onSubmit: async (data: any) => {
      await $request('/api/prompt', {
        method: 'POST',
        body: data,
      })
      modal.close()
      Message.success('增加成功')
      promptTable.value.reload()
    },
    onCancel: () => {
      modal.close()
    },
  }, {
    title: '新规则信息',
    size: 'small',
  })
}
</script>

<template>
  <section>
    <TableRender ref="promptTable" :columns="columns" :data-load="onTableLoad" row-key="id">
      <template #actions>
        <AButton type="primary" @click="onAddClick">
          增加规则
        </AButton>
      </template>
    </TableRender>
  </section>
</template>

<style lang="less" scoped></style>
