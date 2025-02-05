import { inArray } from 'drizzle-orm'
import { objectify } from 'radash'
import { SystemSettingFieldsEnum, SystemSettingSchema } from '~/drizzle/schemas'
import { LangChainService } from '../services/langchain'

export async function useLangchain() {
  const settings = await db.query.SystemSettingSchema.findMany({
    where: inArray(SystemSettingSchema.key, [
      SystemSettingFieldsEnum.AIApiKey,
      SystemSettingFieldsEnum.AIApiURL,
    ]),
  })

  const setting = objectify(settings, x => x.key, x => x.value)

  return new LangChainService({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    AIApiKey: setting.AIApiKey,
    AIApiURL: setting.AIApiURL,
  })
}
