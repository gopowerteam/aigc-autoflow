<script setup lang="ts">
import type { EnglishTextSentence } from '~/drizzle/schemas/english-text-sentence.schema'
import type { EnglishText } from '~/drizzle/schemas/english-text.schema'

definePageMeta({
  layout: 'workspace',
  title: '文本生成',
  requireAuth: true,
  name: 'aigc-english.generate-text',
  menu: {
    key: 'generate-text',
    path: ['aigc-english'],
    index: 1,
  },
})

const form = defineForm([{
  key: 'topic',
  title: '主题',
  rule: [{
    required: true,
    message: '请输入主题',
  }],
}])


let englistText = $ref<Pick<
  EnglishText,
  'title' | 'topic'
>>()

let englishTextSentences = $ref<{
  chinese: string,
  english: string,
  audioBuffer?: AudioBuffer
  audioDuration?: number
}[]>()

let audioContext: AudioContext

function onGenerateText({ topic }: Record<(typeof form)[number]['key'], 'key'>) {
  $request('/api/aigc-english/generate/text', {
    method: 'POST',
    body: {
      topic,
    },
  }).then((result) => {
    englistText = {
      title: result.title,
      topic: result.topic,
    }

    englishTextSentences = result.sentences
  })
}

async function onGenerateAudio() {
  try {
    for (let index = 0; index < englishTextSentences!.length; index++) {
      const scentance = englishTextSentences![index]
      const arrayBuffer = await $request('/api/aigc-english/generate/audio', {
        method: 'POST',
        responseType: 'arrayBuffer',
        body: {
          content: scentance.english,
        },
      }) as ArrayBuffer

      if (arrayBuffer) {
        // 将 ArrayBuffer 解码成 AudioBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        scentance.audioBuffer = audioBuffer
        scentance.audioDuration = audioBuffer.duration
      }
    }
  }
  catch (ex) {
    console.error(ex)
  }
}

async function playAudio(audioBuffer: AudioBuffer) {
  try {
    // 创建音频源
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer

    // 连接到输出设备
    source.connect(audioContext.destination)

    // 开始播放
    source.start(0)

    // 监听播放结束
    source.onended = () => {
      console.log('音频播放完成')
    }
  }
  catch (error) {
    console.error('音频播放失败:', error)
  }
}

function concatenateAudioBuffers(audioBuffers: AudioBuffer[], audioContext: AudioContext): AudioBuffer {
  // 计算总时长
  const totalLength = audioBuffers.reduce((sum, audioBuffer) => sum + audioBuffer.length, 0)
  
  // 创建新的 AudioBuffer
  const result = audioContext.createBuffer(
    audioBuffers[0].numberOfChannels,
    totalLength,
    audioBuffers[0].sampleRate
  )

  // 合并每个通道的数据
  for (let channel = 0; channel < result.numberOfChannels; channel++) {
    const channelData = result.getChannelData(channel)
    let offset = 0

    // 依次拷贝每个 AudioBuffer 的数据
    audioBuffers.forEach(audioBuffer => {
      channelData.set(audioBuffer.getChannelData(channel), offset)
      offset += audioBuffer.length
    })
  }

  return result
}

function playAudioFull(){
  const audioBuffers = englishTextSentences!.map(sentence => sentence.audioBuffer!)
  const fullAudioBuffer = concatenateAudioBuffers(audioBuffers, audioContext)
  playAudio(fullAudioBuffer)
}

onMounted(()=>{
  audioContext =  new AudioContext()
})
</script>

<template>
  <PageContainer append-class="space-y-2">
    <template #actions>
      <AButton type="primary">
        保存
      </AButton>
    </template>
    <ACard title="文本生成" size="small">
      <template #extra>
        <AButton size="mini" type="text" html-type="submit" form="form">
          生成文本
        </AButton>
      </template>
      <FormRender id="form" :form="form" @submit="onGenerateText" />
    </ACard>

    <ACard title="文本预览"  v-if="englishTextSentences?.every(x=>x.english)">
      <template #extra>
        <AButton size="mini" type="text" @click="onGenerateAudio">
          生成音频
        </AButton>
        <AButton size="mini" type="text" @click="playAudioFull" v-if="englishTextSentences?.every(x=>x.audioBuffer)">
          生成音频
        </AButton>
      </template>
      <div>
        <div v-for="sentence in englishTextSentences" :key="sentence.english">
          <div class="flex">
            <div class="flex-auto">
              <AInput v-model="sentence.chinese"></AInput>
              <AInput v-model="sentence.english"></AInput>
            </div>
            <div class="flex items-center justify-center w-50px">
              <AButton shape="circle" type="text" v-if="sentence.audioBuffer"
                @click="() => playAudio(sentence.audioBuffer!)">
                <i class="icon-park-outline:voice-message"></i>
              </AButton>
            </div>
          </div>
          <ADivider />
        </div>
      </div>
    </ACard>
  </PageContainer>
</template>

<style scoped></style>
