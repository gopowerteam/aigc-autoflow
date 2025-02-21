<script setup lang="ts">
import type { AigcEnglishContent } from '~/drizzle/schemas'

definePageMeta({
  layout: 'default',
  title: '图片生成',
  requireAuth: false,
})

const route = useRoute()

let aigcEnglish = $ref<AigcEnglishContent>()
let audioContext: AudioContext

let currentTime = $ref()

const { pause, resume } = useIntervalFn(() => {
  if (audioContext) {
    currentTime = audioContext.currentTime
  }
}, 100)

async function playAudio() {
  navigator.mediaDevices.getUserMedia({ audio: true })

  audioContext = new AudioContext()
  const audioBuffer = await fetch(aigcEnglish!.audio!)
    .then(response => response.arrayBuffer())
    .then(data => audioContext.decodeAudioData(data))

  try {
    // 创建音频源
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer

    // 连接到输出设备
    source.connect(audioContext.destination)

    // 开始播放
    source.start(0)

    currentTime = 0
    resume()

    // 监听播放结束
    source.onended = () => {
      // console.log('音频播放完成')
      pause()
      currentTime = -1
    }
  }
  catch (error) {
    console.error('音频播放失败:', error)
  }
}

async function requestAigcEnglish() {
  const data = await $request('/api/aigc-english/:id', {
    method: 'GET',
    params: {
      id: route.params.id,
    },
  })

  aigcEnglish = data
}

const audioDuirationRanges = $computed(() => {
  if (!aigcEnglish) {
    return []
  }

  const getDurationSum = (currentIndex: number) => {
    return aigcEnglish!.sentences.reduce<number>((duration, sentence, index) => {
      if (currentIndex > index) {
        duration += sentence.audioDuration
      }
      return duration
    }, 0)
  }

  const ranges = aigcEnglish.sentences?.map((sentence, index) => {
    const start = getDurationSum(index)
    return {
      start,
      end: start + sentence.audioDuration,
    }
  })

  return ranges
})

onMounted(async () => {
  await requestAigcEnglish()
  window.playAudio = playAudio
})
</script>

<template>
  <section v-if="aigcEnglish" class="page-container absolute inset-0 flex items-center justify-center">
    <div class="space-y-4">
      <div
        v-for="(sentence, index,) in aigcEnglish?.sentences"
        :key="sentence.id"
        class="text-center space-y-1" :class="{ title: index === 0, active: currentTime >= audioDuirationRanges[index].start && currentTime <= audioDuirationRanges[index].end }"
      >
        <div class="english text-20px text-#333">
          {{ sentence.english }}
        </div>
        <div
          class="chinese text-16px text-#999 tracking-wider"
        >
          {{ sentence.chinese }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page-container {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='20' height='0' fill='%23fff' /%3E%3Crect x='50%' width='1' height='100%' fill='rgb(245 245 245)' /%3E%3Crect y='50%' width='100%' height='1' fill='rgb(245 245 245)' /%3E%3C/svg%3E%0A");
}

.title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
  color: #000;
}

.active {
  background-color: blue;
  border-radius: 10px;
  padding: 10px;
  font-weight: bold;

  .english {
    color: #fff !important;
  }

  .chinese {
    color: #eee !important;
  }
}
</style>
