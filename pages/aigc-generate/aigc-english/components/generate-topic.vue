<script setup lang="ts">
const emits = defineEmits<{
  submit: [topic: string]
}>()

let title = $ref<string>('')
let loading = $ref<boolean>(false)
let titles = $ref<{
  english: string
  chinese: string
}[]>([])

async function requestRandomTitles() {
  loading = true

  try {
    const response = await $request('/api/aigc-english/generate/title', {
      method: 'POST',
    })

    if (response) {
      titles = response.titles
    }
  }
  catch (error) {
    console.error('生成标题失败:', error)
  }
  finally {
    loading = false
  }
}

function updateTitle(value: string) {
  title = value
}

// 组件加载时自动生成标题
onMounted(() => {
  requestRandomTitles()
})
</script>

<template>
  <div class="aaaa">
    <ATabs type="capsule" animation>
      <ATabPane key="custom" title="自定义主题">
        <div class="text-center space-y-4">
          <AInput v-model="title" placeholder="请输入自定义的主题" />
          <AButton :disabled="!title" type="primary" size="mini" @click="emits('submit', title)">
            立即生成
          </AButton>
        </div>
      </ATabPane>
      <ATabPane key="random" title="随机主题">
        <div class="text-center space-y-4">
          <ASpin :loading="loading" class="w-full [&>.active]:(border-red-400)">
            <div v-for="item in titles" :key="item.chinese" :class="{ active: title === item.chinese }" class="m-2 cursor-pointer border-1px border-transparent rounded-sm border-solid bg-#efefef p-2 space-y-1" @click="() => updateTitle(item.chinese)">
              <div class="text-3.5">
                {{ item.chinese }}
              </div>
              <div class="text-3 text-#333">
                {{ item.english }}
              </div>
            </div>
          </ASpin>
          <div class="text-center space-x-2">
            <AButton :disabled="!title" type="primary" size="mini" @click="emits('submit', title)">
              立即生成
            </AButton>
            <AButton type="outline" size="mini" @click="requestRandomTitles">
              换一批
            </AButton>
          </div>
        </div>
      </ATabPane>
    </ATabs>
  </div>
</template>

<style lang="scss" scope>
.aaaa :deep(.arco-tabs-nav-tab) {
  justify-content: center !important;
}
</style>
