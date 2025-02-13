<script setup lang="ts">
import type { EnglishTextSentence } from '~/drizzle/schemas/english-text-sentence.schema'
import type { EnglishText } from '~/drizzle/schemas/english-text.schema'
import { useQiniu } from '~/composables/hooks/use-qiniu'

const qiniu = useQiniu()

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

let englistText = $ref<{
  topic: string
  title: string
  image?: string
  audio?: string
}>()

let englishTextSentences = $ref<{
  chinese: string
  english: string
  audioBuffer?: AudioBuffer
  audioDuration?: number
}[]>()

let audioBuffer: AudioBuffer
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
    audioBuffers[0].sampleRate,
  )

  // 合并每个通道的数据
  for (let channel = 0; channel < result.numberOfChannels; channel++) {
    const channelData = result.getChannelData(channel)
    let offset = 0

    // 依次拷贝每个 AudioBuffer 的数据
    audioBuffers.forEach((audioBuffer) => {
      channelData.set(audioBuffer.getChannelData(channel), offset)
      offset += audioBuffer.length
    })
  }

  return result
}

function playAudioFull() {
  const audioBuffers = englishTextSentences!.map(sentence => sentence.audioBuffer!)
  const audioBuffersConcated = concatenateAudioBuffers(audioBuffers, audioContext)
  playAudio(audioBuffersConcated)
  audioBuffer = audioBuffersConcated
}

function audioBufferToFile(): File {
  if (!audioBuffer)
    throw new Error('没有可用的音频数据')

  // 获取音频参数
  const numberOfChannels = audioBuffer.numberOfChannels
  const length = audioBuffer.length
  const sampleRate = audioBuffer.sampleRate

  // 创建 WAV 文件头
  const wavHeader = createWavHeader(length, numberOfChannels, sampleRate)

  // 获取音频数据
  const audioData = new Float32Array(length * numberOfChannels)
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = audioBuffer.getChannelData(channel)
    for (let i = 0; i < length; i++)
      audioData[i * numberOfChannels + channel] = channelData[i]
  }

  // 将音频数据转换为 16 位整数
  const pcmData = new Int16Array(audioData.length)
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i]))
    pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
  }

  // 合并文件头和音频数据
  const wavBlob = new Blob([wavHeader, pcmData], { type: 'audio/wav' })

  // 创建唯一文件名
  const filename = `audio-${Date.now()}.wav`

  return new File([wavBlob], filename, { type: 'audio/wav' })
}

/**
 * 创建 WAV 文件头
 */
function createWavHeader(length: number, numberOfChannels: number, sampleRate: number) {
  const buffer = new ArrayBuffer(44)
  const view = new DataView(buffer)

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + length * 2, true)
  writeString(view, 8, 'WAVE')

  // fmt sub-chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // fmt chunk size
  view.setUint16(20, 1, true) // audio format (1 = PCM)
  view.setUint16(22, numberOfChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * numberOfChannels * 2, true) // byte rate
  view.setUint16(32, numberOfChannels * 2, true) // block align
  view.setUint16(34, 16, true) // bits per sample

  // data sub-chunk
  writeString(view, 36, 'data')
  view.setUint32(40, length * 2, true)

  return buffer
}

/**
 * 写入字符串到 DataView
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++)
    view.setUint8(offset + i, string.charCodeAt(i))
}

async function uploadAudio() {
  const file = await audioBufferToFile()
  return qiniu.upload(file)
}

// function generateImage(){

// }

async function onSave() {
  // if (
  //   !englistText?.title
  //   || !englistText?.topic
  //   // || !englistText?.image
  //   || !englishTextSentences?.length
  // ) {
  //   Message.error('请确实否是已经生成全部内容')
  //   return
  // }

  const url = await uploadAudio()
  console.log(url)
}

onMounted(async () => {
  audioContext = new AudioContext()
})
</script>

<template>
  <PageContainer append-class="space-y-2">
    <template #actions>
      <AButton type="primary" @click="onSave">
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

    <ACard v-if="englishTextSentences?.every(x => x.english)" title="文本预览">
      <template #extra>
        <AButton size="mini" type="text" @click="onGenerateAudio">
          生成音频
        </AButton>
        <AButton v-if="englishTextSentences?.every(x => x.audioBuffer)" size="mini" type="text" @click="playAudioFull">
          生成音频
        </AButton>
      </template>
      <div>
        <div v-for="sentence in englishTextSentences" :key="sentence.english">
          <div class="flex">
            <div class="flex-auto">
              <AInput v-model="sentence.chinese" />
              <AInput v-model="sentence.english" />
            </div>
            <div class="w-50px flex items-center justify-center">
              <AButton
                v-if="sentence.audioBuffer" shape="circle" type="text"
                @click="() => playAudio(sentence.audioBuffer!)"
              >
                <i class="icon-park-outline:voice-message" />
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
