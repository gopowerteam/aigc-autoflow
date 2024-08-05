<script setup lang="ts">
definePageMeta({
  layout: 'workspace',
  title: '新增文章',
  requireAuth: true,
  name: 'post-create',
})

const form = reactive({
  title: '',
  tags: ['关键词'],
})

const rules = {
  title: [{ required: true, type: 'array', message: '请输入文章标题' }],
  tags: [{ required: true, message: '请输入关键词' }],
}

const formRef = ref()

function handleReset() {
  formRef.value.resetFields()
}

async function handleSubmit() {
  const err = await formRef.value.validate()
  if (err)
    return

  await $request('/api/post', { method: 'POST', body: form })

  Message.success('添加成功')

  navigateTo({
    path: '/aigc-generate/post-list',
  })
}
</script>

<template>
  <section>
    <a-form ref="formRef" class="mx-a" :model="form" :rules="rules" :style="{ width: '600px' }" @submit="handleSubmit">
      <a-form-item field="title" label="文章标题" tooltip="文章内容的将按照标题进行生成">
        <a-input v-model="form.title" placeholder="请输入标题名称" allow-clear />
      </a-form-item>
      <a-form-item field="tags" tooltip="内容将含有与关键词相关的信息" label="关键词">
        <a-input-tag v-model:model-value="form.tags" placeholder="请输入关键词，按Enter键输入下一个" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button @click="handleReset">
          重置
        </a-button>
        <a-button type="primary" html-type="submit" class="ml-3">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </section>
</template>
