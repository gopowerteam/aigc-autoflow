<script setup lang="ts">
definePageMeta({
  layout: 'workspace',
  title: '视频生成',
  requireAuth: true,
  name: 'aigc-english.generate-video',
  menu: {
    key: 'generate-video',
    path: ['aigc-english'],
    index: 4,
  },
})
</script>

<template>
  <PageContainer>
    <template #actions>
      <AButton size="mini" type="primary">
        生成文本
      </AButton>
    </template>
  </PageContainer>
</template>

<style scoped>

</style>
