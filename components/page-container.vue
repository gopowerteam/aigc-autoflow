<script setup lang="ts">
import menus from '@/config/menu.config'

const {
  appendClass,
} = defineProps<{
  appendClass?: string
}>()

// const slots = useSlots()
const route = useRoute()
const router = useRouter()

// const showHeader = $computed(() => {
//   return !!slots.actions
// })

const routes = computed(() => {
  const [current, ...items] = route.path.split('/').filter(Boolean).reverse()

  return [
    ...items.map(path => ({
      path,
      label: menus.find(x => x.key === path)?.title || '',
    })),
    {
      path: current,
      label: route.meta.title as string,
    },
  ]
})

const canGoBack = computed(() => {
  if (route.meta.menu) {
    return false
  }
  return window?.history?.state?.back || route.path !== '/'
})

function handleGoBack() {
  router.back()
}
</script>

<template>
  <section class="space-y-4">
    <div class="page-header flex items-center justify-between">
      <div>
        <ABreadcrumb :routes="routes" />
      </div>
      <div class="actions-container flex items-center gap-2">
        <slot name="actions" />
        <AButton
          v-if="canGoBack"
          size="mini"
          type="outline"
          @click="handleGoBack"
        >
          返回
        </AButton>
      </div>
    </div>
    <ADivider />
    <div class="page-body" :class="appendClass">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.actions-container :deep(button) {
  height: 28px;
}
</style>
