<script setup lang="ts">
import menus from '@/config/menu.config'

// const slots = useSlots()
const route = useRoute()

// const showHeader = $computed(() => {
//   return !!slots.actions
// })

const routes = computed(() => {
  const [current, ...items] = route.path.split('/').filter(Boolean).reverse()

  return [
    ...items.map(path => ({
      path,
      label: menus.find(x => x.key === path)!.title,
    })),
    {
      path: current,
      label: route.meta.title as string,
    },
  ]
})
</script>

<template>
  <section class="space-y-4">
    <div class="page-header flex items-center justify-between">
      <div>
        <ABreadcrumb :routes="routes" />
      </div>
      <div class="flex items-center gap-5px">
        <slot name="actions" />
      </div>
    </div>
    <ADivider />
    <div class="page-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>

</style>
