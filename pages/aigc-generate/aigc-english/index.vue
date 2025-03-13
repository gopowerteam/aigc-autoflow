<script setup lang="ts">
import GenerateAudio from './components/generate-audio.vue'
import GenerateContent from './components/generate-content.vue'
import GenerateImage from './components/generate-image.vue'
import GenerateTitle from './components/generate-topic.vue'
import GenerateVideo from './components/generate-video.vue'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const steps = reactive([
  {
    key: 'generate-content',
    duration: 0,
  },
  {
    key: 'generate-audio',
    duration: 0,
  },
  {
    key: 'generate-image',
    duration: 0,
  },
  {
    key: 'generate-video',
    duration: 0,
  },
])

let topic = $ref<string>('')

const data = reactive<{
  topic: string
  sentences: {
    chinese: string
    english: string
    duration?: number
  }[]
  image: string
  audio: string
  video: string
}>({
  topic: '',
  image: '',
  audio: '',
  video: '',
  sentences: [],
})

let currentStep = $ref<number>(-1)
const taskListeners: { task: string, callback: () => Promise<void> }[] = []

provide(InjectKeys.aigc.english.addTaskListener, (task: string, callback: () => Promise<void>) => {
  taskListeners.push({
    task,
    callback,
  })
})

const { pause, resume } = useIntervalFn(() => {
  steps[currentStep].duration += 1
}, 1000, {
  immediate: false,
})

definePageMeta({
  title: '英语短文',
  requireAuth: false,
  name: 'aigc-generate.aigc-english',
  menu: {
    key: 'aigc-english',
    path: ['aigc-generate'],
    index: 1,
  },
})

async function onStart(value: string) {
  topic = value

  steps.forEach(x => x.duration = 0)

  for (let i = 0; i < steps.length; i++) {
    currentStep = i
    resume()
    const task = taskListeners.find(x => x.task === steps[i].key)

    if (task) {
      await nextTick(() => task.callback())
    }
    pause()
  }

  currentStep++
}
</script>

<template>
  <DefineTemplate v-slot="{ step }">
    <div class="flex items-center space-x-4">
      <div v-if="currentStep >= steps.findIndex(x => x.key === step)">
        {{ steps.find(x => x.key === step)?.duration }}s
      </div>
      <ASpin v-if="currentStep === steps.findIndex(x => x.key === step)" :size="20" />
      <i
        v-if="currentStep > steps.findIndex(x => x.key === step)"
        class="icon-park-outline:check-one text-5 text-green-500"
      />
    </div>
  </DefineTemplate>

  <div class="absolute inset-0 flex">
    <div class="box-border w-60 p-2">
      <GenerateTitle @submit="onStart" />
    </div>
    <div class="relative flex-auto bg-#333">
      <div class="absolute inset-0 box-border overflow-auto p-10">
        <ACollapse v-show="currentStep >= 0">
          <ACollapseItem key="generate-content" header="生成内容">
            <template #extra>
              <ReuseTemplate step="generate-content" />
            </template>
            <GenerateContent
              v-model:sentences="data.sentences"
              :starting="currentStep >= steps.findIndex(x => x.key === 'generate-content')" :topic="topic"
            />
          </ACollapseItem>
          <ACollapseItem key="generate-audio" header="生成音频">
            <template #extra>
              <ReuseTemplate step="generate-audio" />
            </template>
            <GenerateAudio
              v-model:audio="data.audio" v-model:sentences="data.sentences"
              :starting="currentStep >= steps.findIndex(x => x.key === 'generate-audio')"
            />
          </ACollapseItem>
          <ACollapseItem key="generate-image" header="生成图文">
            <template #extra>
              <ReuseTemplate step="generate-image" />
            </template>
            <GenerateImage
              v-model:image="data.image" v-model:sentences="data.sentences"
              :starting="currentStep >= steps.findIndex(x => x.key === 'generate-image')"
            />
          </ACollapseItem>
          <ACollapseItem key="generate-video" header="生成视频">
            <template #extra>
              <ReuseTemplate step="generate-video" />
            </template>
            <GenerateVideo
              v-model:video="data.video" :audio="data.audio" :sentences="data.sentences"
              :starting="currentStep >= steps.findIndex(x => x.key === 'generate-video')"
            />
          </ACollapseItem>
        </ACollapse>
      </div>
      <div v-show="currentStep < 0">
        <div class="absolute inset-0 flex items-center justify-center">
          <AEmpty>请选择主题后生成短文</AEmpty>
        </div>
      </div>
    </div>
  </div>
</template>
