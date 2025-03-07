import path from 'node:path'
import { Image, Leafer, Line, Platform, Rect, Text, useCanvas } from '@leafer-ui/node'
import napi, { GlobalFonts } from '@napi-rs/canvas'
import { getRootPath } from '~/server/utils/path'

useCanvas('napi', napi)

const fontFamily = 'AlibabaPuHuiTi'
GlobalFonts.registerFromPath(
  path.join(getRootPath(), 'fonts', 'AlibabaPuHuiTi-Regular.ttf'),
  fontFamily,
)

const padding = 20
const englishTitleHeight = 32
const chineseTitleHeight = 24
const titleLineGap = 10
const titleGroupGap = 40
const englishLineHeight = 28
const chineseLineHeight = 24
const textLineGap = 10
const groupLineGap = 20
const width = 800
const lineHeight = chineseLineHeight + englishLineHeight + textLineGap + groupLineGap
const titleOffset = englishTitleHeight + chineseTitleHeight + titleLineGap + titleGroupGap + padding

// const PostSchema = z.object({
//   sentences: z.array(
//     z.object({
//       chinese: z.string(),
//       english: z.string(),
//     }),
//   ),
// })

const sentences = [
  {
    english: 'In a small village, there lived a girl.',
    chinese: '在一个小村庄里，住着一个女孩。',
  },
  {
    english: 'Her name was Xiaohua, and she loved to explore.',
    chinese: '她的名字叫小花，喜欢探索。',
  },
  {
    english: 'One day, she found a crystal ball in the forest.',
    chinese: '一天，她在森林里发现了一个水晶球。',
  },
  {
    english: 'The crystal ball sparkled and was as beautiful as stars.',
    chinese: '这个水晶球闪闪发光，像星星一样美。',
  },
]

/**
 * 绘制网格背景
 * @param leafer
 * @param width
 * @param height
 */
function drawBackground(leafer: Leafer, width: number, height: number) {
  const background = new Rect({
    x: 0,
    y: 0,
    width,
    height,
    fill: '#fff',
  })

  leafer.add(background)

  for (let i = 0; i < height; i += 20) {
    const line = new Line({
      points: [0, i, width, i],
      strokeWidth: 1,
      stroke: 'rgb(245 245 245)'
    })

    leafer.add(line)
  }

  for (let i = 0; i < width; i += 20) {
    const line = new Line({
      points: [i, 0, i, height],
      strokeWidth: 1,
      stroke: 'rgb(245 245 245)'
    })

    leafer.add(line)
  }

}

function drawTitle(leafer: Leafer, title: { chinese: string, english: string }) {
  const english = new Text({
    x: 0,
    y: padding,
    width,
    height: englishTitleHeight,
    text: title.english,
    fontFamily,
    textAlign: 'center',
    fontSize: englishTitleHeight,
    fontWeight: 'bold'
  })
  const chinese = new Text({
    x: 0,
    y: englishTitleHeight + titleLineGap + padding,
    width,
    height: chineseTitleHeight,
    text: title.chinese,
    fontFamily,
    textAlign: 'center',
    fontSize: chineseTitleHeight,
    fill: '#333',
  })

  leafer.add(english)
  leafer.add(chinese)
}

function drawContent(leafer: Leafer, content: { chinese: string, english: string }[]) {
  content.forEach((item, index) => {
    const english = new Text({
      x: 0,
      y: lineHeight * index + titleOffset,
      width,
      height: englishLineHeight,
      text: item.english,
      fontFamily,
      textAlign: 'center',
      fontSize: englishLineHeight,
    })
    const chinese = new Text({
      x: 0,
      y: lineHeight * index + englishLineHeight + textLineGap + titleOffset,
      width,
      height: chineseLineHeight,
      text: item.chinese,
      fontFamily,
      textAlign: 'center',
      fontSize: chineseLineHeight,
      fill: '#333',
    })

    leafer.add(english)
    leafer.add(chinese)
  })
}

async function drawImage(sentences: { chinese: string, english: string }[]) {
  const [title, ...content] = sentences
  const height = titleOffset + content.length * lineHeight + padding
  const leafer = new Leafer({ width, height })

  drawBackground(leafer, width, height)
  drawTitle(leafer, title)
  drawContent(leafer, content)

  const result = await leafer.export('png', { pixelRatio: 2, blob: true })

  return result.data
}

export default defineEventHandler(async (event) => {
  const image = await drawImage(sentences)

  setResponseHeaders(event, {
    'Content-Type': 'image/png',
  })

  return image
})
