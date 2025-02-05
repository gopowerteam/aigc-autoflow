import type { EventHandler, EventHandlerRequest } from 'h3'
import { H3Error } from 'h3'

export function defineAuthEventHandler<T extends EventHandlerRequest, D>(handler: EventHandler<T, D>): EventHandler<T, D> {
  return defineEventHandler<T>(async (event) => {
    if (!event.context.user) {
      throw createError({
        statusCode: 403,
        message: 'Unauthorized',
        fatal: false,
      })
    }

    try {
      return await handler(event)
    }
    catch (err) {
      if (err instanceof H3Error) {
        throw err
      }
      else {
        console.error(err)

        throw createError({
          statusCode: 500,
          fatal: false,
        })
      }
    }
  })
}
