import { createInsertSchema } from 'drizzle-zod'
import { z } from 'h3-zod'
import { EnglishTextSentenceSchema } from '~/drizzle/schemas/english-text-sentence.schema'
import { EnglishTextSchema } from '~/drizzle/schemas/english-text.schema'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = z.object({
  text: createInsertSchema(EnglishTextSchema),
  sentences: z.array(createInsertSchema(EnglishTextSentenceSchema)).nonempty(),
})

export default defineAuthEventHandler(async (event) => {
  const { text, sentences } = await useSafeBody(event, BodySchema)
  const [data] = await db.insert(EnglishTextSchema).values(text).returning()

  if (data.id) {
    await db.insert(EnglishTextSentenceSchema).values(
      sentences.map(x => ({
        ...x,
        textId: data.id,
      })),
    )
  }

  return text
})
