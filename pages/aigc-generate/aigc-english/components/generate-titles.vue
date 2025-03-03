<script setup lang="ts">
interface Title {
  english: string
  chinese: string
}

const emit = defineEmits<{
  (event: 'select', title: Title): void
}>()

const titles = ref<Title[]>([])

async function generateTitles() {
  try {
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
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <a-card
        v-for="title in titles" :key="title.english" class="cursor-pointer transition-shadow hover:shadow-lg"
        :hoverable="true" @click="handleTitleSelect(title)"
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
