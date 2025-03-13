import fs from 'node:fs'
import path from 'node:path'
import { FFCreator, FFCreatorCenter, FFScene, FFText } from 'ffcreator'
import { z } from 'h3-zod'
import { useQiniu } from '~/server/hooks/use-qiniu'
import { useSafeBody } from '~/server/hooks/use-safe-validate'
import { getRootPath } from '~/server/utils/path'

const ROOT = getRootPath()
const FONT = path.join(getRootPath(), 'fonts', 'AlibabaPuHuiTi-Regular.ttf')
const CACHE_DIR = path.join(ROOT, 'videos', 'cache')
const OUTPUT_DIR = path.join(ROOT, 'videos', 'output')
const VIDEO_WIDTH = 600
const VIDEO_HEIGHT = 400
const CHINESE_FONTSIZE = 24
const ENGLISH_FONTSIZE = 28

const qiniu = useQiniu()
const PostSchema = z.object({
  sentences: z.array(z.object({
    chinese: z.string(),
    english: z.string(),
    duration: z.number(),
  })),
  audio: z.string().url(),
})

function createVideo(sentences: { chinese: string, english: string, duration?: number }[], audio: string) {
  // create creator instance
  const creator = new FFCreator({
    cacheDir: CACHE_DIR,
    outputDir: OUTPUT_DIR,
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
  })

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i]
    const scene = new FFScene()
    scene.setBgColor('#FFFFFF')

    const english = new FFText({
      text: sentence.english,
      font: FONT,
      fontSize: ENGLISH_FONTSIZE,
      color: '#000000',
      x: VIDEO_WIDTH / 2,
      y: (VIDEO_HEIGHT / 2) - ENGLISH_FONTSIZE,
    })

    english.alignCenter()

    const chinese = new FFText({
      text: sentence.chinese,
      font: FONT,
      fontSize: CHINESE_FONTSIZE,
      color: '#333333',
      x: VIDEO_WIDTH / 2,
      y: (VIDEO_HEIGHT / 2) + CHINESE_FONTSIZE,
    })

    chinese.alignCenter()

    scene.addChild(english)
    scene.addChild(chinese)
    scene.setDuration(sentence.duration!)
    creator.addChild(scene)
  }

  creator.addAudio(audio) // 俩种配置方式
  creator.start()

  return creator
}

export default defineEventHandler(async (event) => {
  const { sentences, audio } = await useSafeBody(event, PostSchema)

  const taskId = FFCreatorCenter.addTask(() => {
    return createVideo(sentences, audio)
  })

  return new Promise<{ url: string }>((resolve, reject) => {
    FFCreatorCenter.onTaskComplete(taskId, async (result: any) => {
      const buffer = await fs.readFileSync(result.file)
      const url = await qiniu.upload(buffer)
      fs.rmSync(result.file)
      resolve({ url })
    })

    FFCreatorCenter.onTaskError(taskId, (error: any) => {
      console.error('Video generation failed:', error)
      reject(new Error(`Failed to generate video: ${error.message}`))
    })
  })
})
