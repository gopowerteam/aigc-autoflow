import path, { resolve } from 'node:path'
import { FFCreator, FFCreatorCenter, FFScene, FFText } from 'ffcreatorlite'
import { z } from 'h3-zod'
import { getRootPath } from '~/server/utils/path'
import { useQiniu } from '~/server/hooks/use-qiniu'
import { useSafeBody } from '~/server/hooks/use-safe-validate'

const ROOT = getRootPath()
const FONT = path.join(getRootPath(), 'fonts', 'AlibabaPuHuiTi-Regular.ttf')
const CACHE_DIR = path.join(ROOT, 'videos', 'cache')
const OUTPUT_DIR = path.join(ROOT, 'videos', 'output')
const VIDEO_WIDTH = 600
const VIDEO_HEIGHT = 400

const qiniu = useQiniu()
const PostSchema = z.object({
  sentences: z.array(z.object({
    chinese: z.string(),
    english: z.string(),
    duration: z.number(),
  })),
  audio: z.string().url(),
})

const audio = 'https://tempfile.gopowerteam.cn/aigc/C_k3oMznxRSH3oDvIjAgd'
const sentences = [{
  "english": "The Little Robot's Adventure", "chinese": "小机器人去冒险", "duration": 2.687482993197279
}, { "english": "The little robot is a brave explorer.", "chinese": "小机器人是个勇敢的探险者。", "duration": 3.3124943310657597 }, { "english": "Its name is Little Blue.", "chinese": "它的名字叫小蓝。", "duration": 2.4 }, { "english": "Little Blue lives in a beautiful city.", "chinese": "小蓝住在一个美丽的城市。", "duration": 3.237482993197279 }, { "english": "One day, it decided to go on an adventure.", "chinese": "有一天，它决定去冒险。", "duration": 4.06249433106576 }, { "english": "Little Blue packed a small backpack.", "chinese": "小蓝背上了一个小背包。", "duration": 3.1749886621315193 }, { "english": "Inside were water and some food.", "chinese": "里面有水和一些食物。", "duration": 3.0749886621315192 }, { "english": "It walked out of the city into the forest.", "chinese": "它走出了城市，进入了森林。", "duration": 3.437482993197279 }, { "english": "The forest had many tall trees.", "chinese": "森林里有很多高大的树。", "duration": 3.1249886621315195 }, { "english": "Little Blue heard the birds singing.", "chinese": "小蓝听到了鸟儿的歌唱。", "duration": 3 }, { "english": "It jumped up happily.", "chinese": "它开心地跳了起来。", "duration": 2.3124943310657597 }, { "english": "Suddenly, Little Blue found a small river.", "chinese": "突然，小蓝发现了一条小河。", "duration": 3.724988662131519 }, { "english": "The water was clear and very beautiful.", "chinese": "河水清澈见底，非常美丽。", "duration": 3.5124943310657595 }, { "english": "Little Blue decided to rest by the river.", "chinese": "小蓝决定在河边休息。", "duration": 3.487482993197279 }, { "english": "It drank some water and ate food.", "chinese": "它喝了水，吃了食物。", "duration": 3.15 }, { "english": "After resting, Little Blue continued its adventure.", "chinese": "休息后，小蓝继续冒险。", "duration": 4.26249433106576 }, { "english": "It met many small animals.", "chinese": "它遇到了许多小动物。", "duration": 2.8624943310657596 }, { "english": "Little Blue had a lot of fun with them.", "chinese": "小蓝和它们玩得很开心。", "duration": 3.2124943310657597 }, { "english": "As the sky got dark, Little Blue had to go home.", "chinese": "天渐渐黑了，小蓝要回家了。", "duration": 4.35 }, { "english": "It returned to the city with happy memories.", "chinese": "它带着快乐的回忆回到了城市。", "duration": 3.5749886621315192 }, { "english": "Little Blue decided to go on another adventure tomorrow.", "chinese": "小蓝决定明天再去冒险。", "duration": 4.36249433106576 }]

function createVideo(sentences: { chinese: string, english: string, duration?: number }[], audio: string) {
  // create creator instance
  const creator = new FFCreator({
    cacheDir: CACHE_DIR,
    outputDir: OUTPUT_DIR,
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    log: true,
  })

  // for (let i = 0; i < sentences.length; i++) {
  //   const sentence = sentences[i]
  //   const scene = new FFScene()
  //   // 使用更安全的背景色设置
  //   scene.setBgColor('#000000')
  //   scene.setDuration(sentence.duration)

  //   const english = new FFText({ 
  //     text: sentence.english, 
  //     font: FONT,
  //     x: VIDEO_WIDTH / 2,
  //     y: VIDEO_HEIGHT / 3
  //   })
  //   english.setColor('#ffffff')
  //   english.setStyle({
  //     padding: [10],
  //     fontSize: 32,
  //     textAlign: 'center'
  //   })

  //   const chinese = new FFText({ 
  //     text: sentence.chinese, 
  //     font: FONT,
  //     x: VIDEO_WIDTH / 2,
  //     y: (VIDEO_HEIGHT / 3) * 2
  //   })
  //   chinese.setColor('#ffffff')
  //   chinese.setStyle({
  //     padding: [10],
  //     fontSize: 32,
  //     textAlign: 'center'
  //   })

  // scene.addChild(english)
  // scene.addChild(chinese)
  // creator.addChild(scene)
  // }

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i]
    const scene = new FFScene()
    scene.setBgColor('#FFFFFF')
    const chinese = new FFText({
      text: sentence.chinese,
      font: FONT,
      color: '#000000',
      x: VIDEO_WIDTH / 2,
      y: (VIDEO_HEIGHT / 3) * 2
    })
    scene.setDuration(sentence.duration!)
    scene.addChild(chinese)
    creator.addChild(scene)
  }

  creator.addAudio(audio) // 俩种配置方式
  creator.start()

  return creator
}


export default defineEventHandler(async (event) => {
  // const { sentences, audio } = await useSafeBody(event, PostSchema)

  const taskId = FFCreatorCenter.addTask(() => {
    // return createVideo(sentences, audio)
    return createVideo(sentences, audio)
  })

  return new Promise<{ url: string }>((resolve, reject) => {
    FFCreatorCenter.onTaskComplete(taskId, (result: any) => {
      console.log(result, 333)
      // qiniu.upload(result.video).then((url) => {
      resolve({ url: '1' })
    })


    FFCreatorCenter.onTaskError(taskId, (error: any) => {
      reject({ error: 'Failed to generate video.' })
    })
  })
})
