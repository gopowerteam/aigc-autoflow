<script setup lang="ts">
const { title } = useAppConfig()
</script>

<template>
  <section class="flex flex-row items-center bg-white space-x-2" :class="$style.host">
    <div class="text-xl">
      {{ title }}
    </div>
  </section>
</template>

<style lang="scss" scoped module>
.host {
  font-weight: bold;
  font-size: 30px;
  padding: 0 20px;
}
</style>
