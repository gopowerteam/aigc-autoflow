<script setup lang="ts">
const { $viewport } = useNuxtApp()
const { workspace } = useAppConfig()
const { sider } = useLayoutStore()
const { siderMenus } = useMenuStore()

const route = useRoute()

function onMenuItemClick(path: string) {
  navigateTo(path)
}
</script>

<template>
  <section>
    <AMenu
      v-model:collapsed="sider.collapsed"
      :accordion="$viewport.match('desktop')"
      auto-open
      class="sider-menu inset-0 absolute!"
      :collapsed-width="workspace.sider.collapsedWidth"
      :default-selected-keys="[route.path]"
      :mode="workspace.menu.mode"
      router
      :show-collapse-button="$viewport.match('desktop')"
      @menu-item-click="onMenuItemClick"
    >
      <MenuItem v-for="menu in siderMenus" :key="menu.key" :menu="menu" />
    </AMenu>
  </section>
</template>

<style lang="scss" scoped>
</style>
