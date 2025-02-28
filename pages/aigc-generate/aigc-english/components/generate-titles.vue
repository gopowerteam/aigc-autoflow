<script setup lang="ts">
interface Title {
  english: string
  chinese: string
}

const emit = defineEmits<{
  (event: 'select', title: Title): void
}>()
const loading = ref(false)
const titles = ref<Title[]>([])

async function generateTitles() {
  try {
    loading.value = true
    const response = await $request('/api/aigc-english/generate/title', {
      method: 'POST',
    })

    if (response) {
      titles.value = response.titles
    }
  }
  catch (error) {
    console.error('生成标题失败:', error)
  }
  finally {
    loading.value = false
  }
}

function handleTitleSelect(title: Title) {
  emit('select', title)
}

// 组件加载时自动生成标题
onMounted(() => {
  generateTitles()
})
</script>

<template>
  <div class="w-full">
    <div class="mb-4 flex items-center justify-between">
      <div class="text-lg font-semibold">
        标题生成
      </div>
      <a-button
        :loading="loading"
        type="primary"
        @click="generateTitles"
      >
        重新生成
      </a-button>
    </div>

    <div v-if="loading" class="w-full flex justify-center py-8">
      <a-spin dot />
    </div>

    <div
      v-else
      class="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <a-card
        v-for="title in titles"
        :key="title.english"
        class="cursor-pointer transition-shadow hover:shadow-lg"
        :hoverable="true"
        @click="handleTitleSelect(title)"
      >
        <div class="space-y-2">
          <div class="text-base font-medium">
            {{ title.english }}
          </div>
          <div class="text-sm text-gray-600">
            {{ title.chinese }}
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>
