<script lang="ts" setup>
const { workspace } = useAppConfig()
const store = useStore()
</script>

<template>
  <ALayout class="workspace">
    <ALayoutHeader class="relative z-20" :style="{ height: `${workspace.header.height}px` }">
      <Header />
    </ALayoutHeader>
    <ALayout id="layout-container">
      <ALayoutSider
        class="relative"
        :collapsed="store.layout.sider.collapsed"
        :collapsed-width="workspace.sider.collapsedWidth"
        :width="workspace.sider.width"
      >
        <Sider />
      </ALayoutSider>

      <ALayout class="relative p-0!">
        <AScrollbar
          outer-class="absolute! inset-0"
          :style="{ minHeight: '100%', display: 'flex', flexDirection: 'column' }"
        >
          <ALayoutHeader height="auto">
            <ContentHeader />
          </ALayoutHeader>
          <ALayoutContent class="mian-container flex-auto" :style="`padding:0 ${workspace.content.padding}px;`">
            <slot />
          </ALayoutContent>
          <ALayoutFooter height="auto">
            <ContentFooter />
          </ALayoutFooter>
        </AScrollbar>
      </ALayout>
    </ALayout>
  </ALayout>
</template>

<style scoped>
.workspace {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>
