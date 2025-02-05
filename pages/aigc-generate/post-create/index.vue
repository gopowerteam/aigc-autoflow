<script setup lang="ts">
import type { FieldRule } from '@arco-design/web-vue'

const { data } = await useRequest('/api/prompt/tags')
const formId = useId()
definePageMeta({
  layout: 'workspace',
  title: '新增文章',
  requireAuth: true,
  name: 'post-create',
})

const form = reactive<{
  title: string
  tags: string[]
  content: string
}>({
  title: '',
  tags: [],
  content: '',
})

const rules: Record<string, FieldRule[]> = {
  title: [{ required: true, message: '请输入文章标题' }],
  tags: [{ required: true, message: '请输入关键词' }],
  content: [{ required: true, message: '文章内容不能唯恐' }],
}

async function onGenerate(promptId: string) {
  if (!form.title) {
    return Message.warning('请填写文章标题和文章标签')
  }

  const { content } = await $request('/api/post/generate', {
    method: 'POST',
    body: {
      title: form.title,
      promptId,
    },
  })

  if (content) {
    form.content = content
  }
}

async function onCreate() {
  await $request('/api/post', { method: 'POST', body: form })

  Message.success('添加成功')

  navigateTo({
    path: '/aigc-generate/post-list',
  })
}
</script>

<template>
  <PageContainer>
    <template #actions>
      <ADropdown @select="(value) => onGenerate(value as string)">
        <a-button type="primary">
          生成内容
        </a-button>
        <template #content>
          <ADoption v-for="item in data.tags" :key="item.id" :value="item.id">
            {{ item.tag }}
          </ADoption>
        </template>
      </ADropdown>
      <a-button :form="formId" type="primary" html-type="submit">
        保存
      </a-button>
      <a-button @click="() => $router.back()">
        取消
      </a-button>
    </template>
    <a-form :id="formId" :model="form" :rules="rules" :style="{ width: '600px' }" @submit-success="onCreate">
      <a-form-item field="title" label="文章标题" tooltip="文章内容的将按照标题进行生成">
        <a-input v-model="form.title" placeholder="请输入标题名称" allow-clear />
      </a-form-item>
      <a-form-item field="tag" tooltip="内容将含有与关键词相关的信息" label="关键词">
        <a-input-tag v-model:model-value="form.tags" placeholder="请输入关键词，按Enter键输入下一个" allow-clear />
      </a-form-item>
      <a-form-item field="content" tooltip="文章内容" label="内容">
        <a-textarea v-model="form.content" :auto-size="{ minRows: 10 }" placeholder="请输入文章内容" allow-clear />
      </a-form-item>
    </a-form>
  </PageContainer>
</template>
