import { PromptSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async () => {
  const tags = await db.selectDistinctOn(
    [
      PromptSchema.tag,
    ],
    {
      id: PromptSchema.id,
      tag: PromptSchema.tag,
    },
  ).from(PromptSchema).orderBy(PromptSchema.tag)

  return {
    tags,
  }
})
