import { z } from 'h3-zod'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'
import { useSpeech } from '~/server/utils/use-speech'

const PostSchema = z.object({
  content: z.string(),
})

export default defineAuthEventHandler(async (event) => {
  const { content } = await useSafeBody(event, PostSchema)

  const speech = useSpeech()

  const audio = await speech.synthesizeSpeech(content)
  return new Response(audio as ArrayBuffer, {
    headers: {
      'Content-Type': 'audio/wav',
    },
  })
})
