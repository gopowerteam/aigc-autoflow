import { z } from 'h3-zod'
import { AigcEnglishContentSchema } from '~/drizzle/schemas/aigc-english-content.schema'
import { AigcEnglishSentenceSchema } from '~/drizzle/schemas/aigc-english-sentence.schema'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = z.object({
  topic: z.string(),
  audio: z.string(),
  title: z.object({
    chinese: z.string().nonempty(),
    english: z.string().nonempty(),
  }),
  sentences: z.array(z.object({
    chinese: z.string().nonempty(),
    english: z.string().nonempty(),
    audioDuration: z.number(),
  })),
})

export default defineAuthEventHandler(async (event) => {
  const { topic, title, audio, sentences } = await useSafeBody(event, BodySchema)

  const [result] = await db.insert(AigcEnglishContentSchema).values({
    topic,
    audio,
    titleChinese: title.chinese,
    titleEnglish: title.english,
  }).returning()

  await db.insert(AigcEnglishSentenceSchema).values(
    sentences.map(sentence => ({
      textId: result.id,
      ...sentence,
    })),
  )
})
