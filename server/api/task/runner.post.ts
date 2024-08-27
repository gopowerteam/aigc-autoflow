import { eq } from 'drizzle-orm'
import { BatchSchema, PostSchema, TaskSchema } from '~/drizzle/schemas'

export default defineEventHandler(async () => {
  const task = await db.query.TaskSchema.findFirst({
    where: eq(TaskSchema.completed, false),
    with: {
      prompt: true,
    },
  })

  if (!task || !task?.prompt) {
    return
  }

  const langchain = await useLangchain()

  const content = await langchain.invoke(task.prompt.template, {
    input: task.input!,
  })

  await db.insert(PostSchema).values({
    title: task.title!,
    content: content!,
    tags: [task.prompt.tag],
  })

  await db.update(TaskSchema)
    .set({
      completed: true,
    })
    .where(
      eq(TaskSchema.id, task.id),
    )

  if (task.batchId) {
    const batch = await db.query.BatchSchema.findFirst({
      where: eq(BatchSchema.id, task.batchId),
      with: {
        tasks: true,
      },
    })

    if (batch?.tasks.every(x => x.completed === true)) {
      await db.update(BatchSchema)
        .set({ completed: true })
        .where(eq(BatchSchema.id, batch.id))
    }
  }

  $fetch('/api/task/runner', { method: 'POST' })
})
