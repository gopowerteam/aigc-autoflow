import { z } from 'h3-zod'
import { BatchSchema, TaskSchema } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const BodySchema = z.object({
  tasks: z.array(z.string()),
  promptId: z.string(),
})

export default defineAuthEventHandler(async (event) => {
  const { tasks, promptId } = await useSafeBody(event, BodySchema)
  const [batch] = await db.insert(BatchSchema).values({}).returning()

  await db.insert(TaskSchema).values(
    tasks.map(x => ({
      title: x,
      input: x,
      promptId,
      batchId: batch.id,
    })),
  )

  $fetch('/api/task/runner', { method: 'POST' })
})
