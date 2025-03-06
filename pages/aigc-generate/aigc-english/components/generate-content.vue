<script setup lang="ts">
const { topic } = defineProps<{
  topic: string
  starting: boolean
}>()

const loading = ref(true)
const title = ref<{ english: string, chinese: string }>()
const sentences = defineModel<{
  english: string
  chinese: string
}[]>('sentences')

const addTaskListener = inject(InjectKeys.aigc.english.addTaskListener)

async function onGenerateContent() {
  loading.value = true

  const result = await $request('/api/aigc-english/generate/content', {
    method: 'POST',
    body: {
      topic,
    },
  }).finally(() => {
    loading.value = false
  })

  title.value = result.title

  sentences.value = [
    result.title,
    ...result.sentences,
  ]
}

onMounted(() => {
  if (addTaskListener) {
    addTaskListener('generate-content', onGenerateContent)
  }
})
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center">
    <ASpin v-if="starting" loading tip="内容正在生成中..." />
    <div v-else class="py-4 text-center text-#333">
      等待执行
    </div>
  </div>

  <div v-else class="text-center space-y-2">
    <div v-for="(sentence, index) in sentences" :key="index">
      <div class="text-3.5">
        {{ sentence.chinese }}
      </div>
      <div class="text-3.5">
        {{ sentence.english }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
