<script setup lang="ts">
definePageMeta({
  layout: 'workspace',
  title: '新增批次',
  requireAuth: true,
  // name: 'batch-create',
})

const form = reactive({
  category: '',
  title: ['文章标题'],
})

const rules = {
  category: [{ required: true, message: '请输入分类名称' }],
  title: [{ required: true, type: 'array', message: '请输入文章标题' }],
}

const formRef = ref()

function handleReset() {
  formRef.value.resetFields()
}

function handleSubmit() {
  formRef.value.validate().then((err: any) => {
    if (!err) {
      navigateTo({
        path: '/aigc-generate/batch-list',
      })
    }
  })
}
</script>

<template>
  <section>
    <a-form ref="formRef" class="mx-a" :model="form" :rules="rules" :style="{ width: '600px' }" @submit="handleSubmit">
      <a-form-item field="category" tooltip="将生成内容的分类" label="分类名称">
        <a-input v-model="form.category" placeholder="请输入分类名称" allow-clear />
      </a-form-item>
      <a-form-item field="title" label="文章标题">
        <a-input-tag v-model:model-value="form.title" placeholder="请输入文章标题,按Enter键输入下一个" allow-clear />
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
