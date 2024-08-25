<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'

const { data } = await useRequest('/api/prompt/tags')

definePageMeta({
  layout: 'workspace',
  title: '创建批次',
  requireAuth: true,
  name: 'batch-create',
})

const form = reactive<{
  prompt: string
  content: string
}>({
  prompt: '',
  content: '',
})

const rules: Record<string, FieldRule[]> = {
  prompt: [{ required: true, message: '请选择提示词' }],
  content: [{ required: true, message: '批次内容不能唯恐' }],
}

async function onCreate() {
  await $request('/api/batch', { method: 'POST', body: {
    tasks: form.content.split('\n'),
    promptId: form.prompt,
  } })

  Message.success('创建成功')

  navigateTo({
    path: '/aigc-generate/batch-list',
  })
}
</script>

<template>
  <PageContainer>
    <template #actions>
      <a-button form="batch" type="primary" html-type="submit">
        创建
      </a-button>
      <a-button @click="() => $router.back()">
        取消
      </a-button>
    </template>
    <a-form v-id:form="'batch'" :model="form" :rules="rules" :style="{ width: '600px' }" @submit-success="onCreate">
      <a-form-item field="prompt" tooltip="内容将含有与关键词相关的信息" label="关键词">
        <a-select
          v-model="form.prompt"
          :options="data.tags.map(x => ({
            label: x.tag,
            value: x.id,
          }))"
        />
      </a-form-item>
      <a-form-item field="content" tooltip="批次内容(换行分隔)" label="内容">
        <a-textarea v-model="form.content" :auto-size="{ minRows: 10 }" placeholder="请输入批次内容" allow-clear />
      </a-form-item>
    </a-form>
  </PageContainer>
</template>
