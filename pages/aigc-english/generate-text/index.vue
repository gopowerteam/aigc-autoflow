<script setup lang="ts">
definePageMeta({
  layout: 'workspace',
  title: '文本生成',
  requireAuth: true,
  name: 'aigc-english.generate-text',
  menu: {
    key: 'generate-text',
    path: ['aigc-english'],
    index: 1,
  },
})

const form = defineForm([{
  key: 'topic',
  title: '主题',
  rule: [{
    required: true,
    message: '请输入主题',
  }],
}])

function onSubmit({ topic }: Record<(typeof form)[number]['key'], 'key'>) {
  $request('/api/aigc-english/generate-text', {
    method: 'POST',
    body: {
      topic,
    },
  }).then(() => {
    Message.success('生成成功')
  })
}
</script>

<template>
  <PageContainer>
    <template #actions>
      <AButton size="mini" type="primary">
        开始生成
      </AButton>
    </template>
    <ACard>
      <FormRender :form="form" submitable :cancelable="false" submit-text="123" @submit="onSubmit" />
    </ACard>
  </PageContainer>
</template>

<style scoped>

</style>
