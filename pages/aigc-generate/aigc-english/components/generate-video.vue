<script setup lang="ts">
const { audio, sentences, starting } = defineProps<{
  starting: boolean
  audio: string
  sentences: {
    english: string
    chinese: string
    duration?: number
  }[]
}>()

const loading = ref(true)
const video = defineModel<string>('video')

const addTaskListener = inject(InjectKeys.aigc.english.addTaskListener)

async function onGenerateVideo() {
  loading.value = true

  const result = await $request('/api/aigc-english/generate/video', {
    method: 'POST',
    body: {
      audio,
      sentences,
    },
  }).finally(() => {
    loading.value = false
  })

  if (result?.url) {
    video.value = result.url
  }
  else {
    console.error('Failed to generate video:', result)
  }
}

onMounted(() => {
  if (addTaskListener) {
    addTaskListener('generate-video', onGenerateVideo)
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
    <video v-if="video" class="py-2" controls :src="video" />
  </div>
</template>

<style scoped></style>
