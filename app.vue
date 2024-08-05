<script setup lang="ts">
import { ModalProvider } from '@gopowerteam/modal-render'
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <ModalProvider>
      <NuxtPage />
    </ModalProvider>
  </NuxtLayout>
</template>
