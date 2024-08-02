<script setup lang="ts">
const a = $ref(12345)
const dayjs = useDayjs()

function request() {

}

definePageMeta({
  layout: 'workspace',
  title: '首页',
  requireAuth: true,
  menu: {
    key: 'home',
    index: 1,
  },
})
</script>

<template>
  <div>
    <i class="icon-park-outline:delete" />
    <i class="icon-svg:icon" />
    <AButton type="primary" @click="request">
      button
    </AButton>
    <div v-if="!$viewport.match('mobile')">
      {{ a }} - {{ dayjs().format('YYYY') }}
      {{ a }} - {{ $dayjs().format('YYYY') }}
    </div>
  </div>
</template>
