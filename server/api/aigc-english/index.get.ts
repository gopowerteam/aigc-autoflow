import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

export default defineAuthEventHandler(async () => {
  return db.query.AigcEnglishContentSchema.findMany()
})
