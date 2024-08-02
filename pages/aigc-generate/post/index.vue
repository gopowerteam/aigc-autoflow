<script setup lang="ts">
definePageMeta({
  layout: 'workspace',
  title: '文章管理',
  requireAuth: true,
  menu: {
    key: 'post',
    path: ['aigc-generate'],
    index: 1,
  },
})
</script>

<template>
  <section>
    文章管理 列表
  </section>
</template>
