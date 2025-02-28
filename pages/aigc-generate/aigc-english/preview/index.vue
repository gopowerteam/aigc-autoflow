<script setup lang="ts">
import type { AigcEnglishContent } from '~/drizzle/schemas'
import { defineColumns, defineTableLoad } from '@gopowerteam/table-render'
import { navigateTo } from 'nuxt/app'

definePageMeta({
  layout: 'workspace',
  title: '生成预览',
  requireAuth: true,
  name: 'aigc-english.generate-preview',
  menu: {
    key: 'generate-video',
    path: ['aigc-english'],
    index: 4,
  },
})

const columns = defineColumns<AigcEnglishContent>([{
  key: 'topic',
  title: '主题',
}, {
  key: 'titleChinese',
  title: '中文标题',
}, {
  key: 'titleEnglish',
  title: '英文标题',
}, {
  key: 'action',
  title: '操作',
  render: r => r.button([{
    content: '预览页面',
    onClick({ id }) {
      navigateTo(`/aigc-english/generate-preview/${id}`)
    },
  }]),
}])

const onTableLoad = defineTableLoad(async ({ update }) => {
  const data = await $request('/api/aigc-english', {
    method: 'GET',
  })
  update(data)
})
</script>

<template>
  <PageContainer>
    <TableRender
      :columns="columns"
      :data-load="onTableLoad"
      row-key="id"
    />
  </PageContainer>
</template>

<style scoped>

</style>
