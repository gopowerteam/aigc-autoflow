import type { LangChainService } from '~/server/services/langchain'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { eq } from 'drizzle-orm'
import { z } from 'h3-zod'
import { SystemSettingFieldsEnum, SystemSettingSchema, SystemSettingScopesEnum } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

async function generateTitles(langchain: LangChainService) {
  const Schema = z.object({
    titles: z.array(
      z.object({
        english: z.string().describe('随机生成的英文标题'),
        chinese: z.string().describe('对应的中文标题翻译'),
      }),
    )
      .length(10)
      .describe('生成10个随机的标题'),
  })

  const llm = langchain.llm.withStructuredOutput(Schema)
  const prompt = ChatPromptTemplate.fromTemplate(`
    请生成10个随机的文章标题，每个标题都要包含英文和对应的中文翻译。
    标题应该是有趣且多样化的，可以涉及生活、科技、文化、教育等不同领域。
    每个标题应该简洁明了，易于理解。
  `)

  const chain = prompt.pipe(llm)
  const result = await chain.invoke({})

  const { data, success } = Schema.safeParse(result)
  if (success)
    return data
  else
    throw new Error('生成标题失败')
}

export default defineAuthEventHandler(async () => {
  const settings = await db.query.SystemSettingSchema.findMany({
    where: eq(SystemSettingSchema.scope, SystemSettingScopesEnum.AigcEnglish),
  })

  const modelName = settings.find(x => x.key === SystemSettingFieldsEnum.AigcEnglishModel)?.value

  if (!modelName) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Model is not found.',
    })
  }

  const langchain = await useLangchain({
    modelName: 'gpt-4o-mini',
  })

  return generateTitles(langchain)
})
