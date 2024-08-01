<script setup lang="ts">
import Text from './components/Text.vue'

definePageMeta({
  layout: 'workspace',
  title: '测试页面',
  name: 'tsxt',
  requireAuth: true,
  menu: {
    index: 2,
  },
})
</script>

<template>
  <div>
    12
    <Text />
  </div>
</template>
