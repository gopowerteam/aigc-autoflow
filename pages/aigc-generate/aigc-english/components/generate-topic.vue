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
            <div v-for="item in titles" :key="item.chinese" :class="{ active: title === item.chinese }" class="m-2 cursor-pointer rounded-sm bg-#efefef p-2 space-y-1  border-solid border-1px border-transparent" @click="() => updateTitle(item.chinese)">
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
  <!-- <div class="w-4/5 space-y-4">
    <div class="text-center">
      <a-radio-group v-model="mode" type="button">
        <a-radio value="custom">
          自定义标题
        </a-radio>
        <a-radio value="random">
          选择标题
        </a-radio>
      </a-radio-group>
    </div>
    <div>
      <div v-if="mode === 'custom'">
        <AInput v-model="title" />
      </div>
      <div v-if="mode === 'random'">
        <AInput v-model="title" />
      </div>
    </div>
  </div> -->
  <!-- <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </div> -->
</template>

<style lang="scss" scope>
.aaaa :deep(.arco-tabs-nav-tab) {
  justify-content: center !important;
}
</style>
