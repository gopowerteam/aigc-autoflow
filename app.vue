<script setup lang="ts">
import { ModalProvider } from '@gopowerteam/modal-render'

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <ModalProvider>
      <NuxtPage />
    </ModalProvider>
  </NuxtLayout>
</template>
