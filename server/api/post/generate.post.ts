import { eq } from 'drizzle-orm'
import { z } from 'h3-zod'
import { PromptSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'
import { useLangchain } from '~/server/utils/use-langchain'

const BodySchema = z.object({
  promptId: z.string(),
  title: z.string(),
})

export default defineAuthEventHandler(async (event) => {
  const { promptId, title } = await useSafeBody(event, BodySchema)

  const prompt = await db.query.PromptSchema.findFirst({
    where: eq(PromptSchema.id, promptId),
  })

  if (!prompt) {
    throw createError({
      statusCode: 500,
      statusMessage: 'prompt is not found.',
    })
  }

  const langchain = await useLangchain()

  const content = await langchain.invoke(prompt.template, {
    input: title,
  })

  return { content }
})
