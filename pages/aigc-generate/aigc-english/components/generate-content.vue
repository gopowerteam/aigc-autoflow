<script setup lang="ts">
const { topic } = defineProps<{
  topic: string
}>()

const loading = ref(true)
const title = defineModel<{
    english: string;
    chinese: string;
}>('title')
const sentences = defineModel<{
    english: string;
    chinese: string;
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
  sentences.value = result.sentences
}

onMounted(() => {
  if (addTaskListener) {
    addTaskListener('generate-content', onGenerateContent)
  }
})
</script>

<template>
  
  <div v-if="loading" class="flex justify-center items-center">
    <ASpin :loading="loading" tip="内容正在生成中..."></ASpin>
  </div>
  <div v-else>
    <div>
      <div>{{ title?.chinese }}</div>
      <div>{{ title?.english }}</div>
    </div>
    <div v-for="(sentence,index) in sentences" :key="index">
      <div class="text-3.5">
        {{ sentence.chinese }}
      </div>
      <div class="text-3.5">
        {{ sentence.chinese }}
      </div>
    </div>
</div>
</template>

<style scoped></style>
