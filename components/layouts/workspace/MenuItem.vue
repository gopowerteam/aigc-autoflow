<script setup lang="ts">
defineProps<{
  menu: PageMenu
}>()
</script>

<template>
  <template v-if="menu.url">
    <AMenuItem :key="menu.url">
      <!-- <template #icon>
      </template> -->
      <span class="menu-title pl-2">
        {{ menu.title }}
      </span>
    </AMenuItem>
  </template>

  <template v-else>
    <ASubMenu :key="menu.key">
      <!-- <template #icon>
        <nuxt-icon v-if="menu.icon" class="text-[18px]" :name="menu.icon" />
      </template> -->
      <template #title>
        <span class="submenu-title pl-2">
          {{ menu.title }}
        </span>
      </template>
      <MenuItem
        v-for="child in menu.children"
        :key="child.key"
        :menu="child"
      />
    </ASubMenu>
  </template>
</template>
