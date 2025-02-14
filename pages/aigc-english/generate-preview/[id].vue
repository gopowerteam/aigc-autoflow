<script setup lang="ts">
import type { AigcEnglishContent } from '~/drizzle/schemas';

definePageMeta({
  layout: 'default',
  title: '图片生成',
  requireAuth: false,
})

const route = useRoute()

let aigcEnglish = $ref<AigcEnglishContent>()
let audioContext: AudioContext

let currentTime = $ref(0)

const {pause, resume} = useIntervalFn(()=>{
  if(audioContext){
    currentTime = audioContext.currentTime;
  }
}, 100)

async function playAudio() {
  navigator.mediaDevices.getUserMedia({ audio: true });

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
      id: route.params.id
    }
  })

  aigcEnglish = data
}

const audioDuirationRanges = $computed(() => {
  if (!aigcEnglish) {
    return []
  }

  const getDurationSum = (currentIndex: number) => {
    return aigcEnglish!.sentences .reduce<number>((duration, sentence, index)=>{
      if (currentIndex > index) {
        duration += sentence.audioDuration
      }
      return duration
    },0)
  }

  const ranges = aigcEnglish.sentences?.map((sentence, index) => {
    const start = getDurationSum(index)
    return {
      start,
      end: start + sentence.audioDuration
    }
  })

  return ranges
})

onMounted(async () => {
  await requestAigcEnglish()
  await playAudio()
})  
</script>

<template>
  <section v-if="aigcEnglish" class="absolute inset-0 flex justify-center items-center">
    <div class="space-y-3 text-18px">
      <div class="text-center space-y-1" 
      :class="{ title: index === 0, active: currentTime>= audioDuirationRanges[index].start &&  currentTime <= audioDuirationRanges[index].end  }"
        v-for="(sentence, index, ) in aigcEnglish?.sentences" :key="sentence.id">
        <div>{{ sentence.english }}</div>
        <div>{{ sentence.chinese }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
}

.active {
  background-color: red;
  border-radius: 10px;
  color:#fff;
  padding: 10px;
  font-weight: bold;
}
</style>
