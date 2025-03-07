<script setup lang="tsx">
const { starting } = defineProps<{
  starting: boolean
}>()

let audioContext: AudioContext

const sentences = defineModel<{
  chinese: string
  english: string
  duration?: number
}[]>('sentences')

const audio = defineModel<string>()
const sentenceAduios: AudioBuffer[] = []
const addTaskListener = inject(InjectKeys.aigc.english.addTaskListener)

async function onGenerateAudio() {
  try {
    // 生成的语音
    for (let index = 0; index < sentences.value!.length; index++) {
      const sentence = sentences.value![index]
      const arrayBuffer = await $request('/api/aigc-english/generate/audio', {
        method: 'POST',
        responseType: 'arrayBuffer',
        body: {
          content: sentence.english,
        },
      }) as ArrayBuffer

      if (arrayBuffer) {
        // 将 ArrayBuffer 解码成 AudioBuffer
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        sentenceAduios.push(audioBuffer)
        sentence.duration = audioBuffer.duration
      }
    }

    // 合并生成语音
    const audioBuffer = mergeAudioBuffers(sentenceAduios)
    const audioBlob = audioBufferToBlob(audioBuffer)

    audio.value = URL.createObjectURL(audioBlob)
  }
  catch (ex) {
    console.error(ex)
  }
  finally {
    //
  }
}

function mergeAudioBuffers(audioBuffers: AudioBuffer[]): AudioBuffer {
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

function audioBufferToBlob(audioBuffer: AudioBuffer): Blob {
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
  return new Blob([wavHeader, pcmData], { type: 'audio/wav' })

  // // 创建唯一文件名
  // const filename = `audio-${Date.now()}.wav`

  // return new File([wavBlob], filename, { type: 'audio/wav' })
}

/**
 * 写入字符串到 DataView
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++)
    view.setUint8(offset + i, string.charCodeAt(i))
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

// async function playAudio(audioBuffer: AudioBuffer) {
//   try {
//     // 创建音频源
//     const source = audioContext.createBufferSource()
//     source.buffer = audioBuffer

//     // 连接到输出设备
//     source.connect(audioContext.destination)

//     // 开始播放
//     source.start(0)

//     // 监听播放结束
//     source.onended = () => {
//       // console.log('音频播放完成')
//     }
//   }
//   catch (error) {
//     console.error('音频播放失败:', error)
//   }
// }

onMounted(() => {
  audioContext = new AudioContext()

  if (addTaskListener) {
    addTaskListener('generate-audio', onGenerateAudio)
  }
})
</script>

<template>
  <audio v-if="audio" controls class="w-full">
    <source :src="audio" type="audio/wav">
  </audio>
  <div v-else class="flex items-center justify-center">
    <ASpin v-if="starting" loading tip="音频正在生成中..." />
    <div v-else class="py-4 text-center text-#333">
      等待执行
    </div>
  </div>
</template>
