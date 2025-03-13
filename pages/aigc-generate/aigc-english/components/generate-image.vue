<script setup lang="tsx">
const { starting } = defineProps<{
  starting: boolean
}>()

const sentences = defineModel<{
  english: string
  chinese: string
}[]>('sentences')

const image = defineModel<string>('image')
const addTaskListener = inject(InjectKeys.aigc.english.addTaskListener)

async function onGenerateImage() {
  const data = await $request('/api/aigc-english/generate/image', {
    method: 'POST',
    body: {
      sentences: sentences.value,
    },
  })

  image.value = data.url as string
}

onMounted(() => {
  if (addTaskListener) {
    addTaskListener('generate-image', onGenerateImage)
  }
})
</script>

<template>
  <div v-if="image">
    <img class="h-full w-full" :src="image">
  </div>
  <div v-else class="flex items-center justify-center">
    <ASpin v-if="starting" loading tip="截图正在生成中..." />
    <div v-else class="py-4 text-center text-#333">
      等待执行
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
