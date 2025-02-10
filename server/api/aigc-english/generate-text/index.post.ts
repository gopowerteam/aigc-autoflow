import type { LangChainService } from '~/server/services/langchain'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { eq } from 'drizzle-orm'
import { z } from 'h3-zod'
import { SystemSettingFieldsEnum, SystemSettingSchema, SystemSettingScopesEnum } from '~/drizzle/schemas'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const PostSchema = z.object({
  topic: z.string(),
})

async function generateEnglishText(langchain: LangChainService, topic: string, prompt: string) {
  const schema = z.object({
    title: z.string().describe('根据主题生成文章标题'),
    sentences: z.array(
      z.object({
        english: z.string().describe('根据主题生成文章的句子的英文原文'),
        chinese: z.string().describe('根据主题生成文章的句子的英文原文对应的中文翻译'),
      }),
    ).describe('根据主题生成文章的句子列表'),
  })

  const llm = langchain.llm.withStructuredOutput(schema)
  const chain = ChatPromptTemplate
    .fromTemplate(prompt)
    .pipe(llm)

  return chain.invoke({
    topic,
  })
}

export default defineAuthEventHandler(async (event) => {
  const { topic } = await useSafeBody(event, PostSchema)

  const settings = await db.query.SystemSettingSchema.findMany({
    where: eq(SystemSettingSchema.scope, SystemSettingScopesEnum.AigcEnglish),
  })

  const modelName = settings.find(x => x.key === SystemSettingFieldsEnum.AigcEnglishModel)?.value
  const modelPrompt = settings.find(x => x.key === SystemSettingFieldsEnum.AigcEnglishPrompt)?.value

  if (!modelName || !modelPrompt) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Model or prompt is not found.',
    })
  }

  const langchain = await useLangchain({
    modelName: 'gpt-3.5-turbo',
  })

  const result = await generateEnglishText(langchain, topic, modelPrompt)

  return {
    result,
  }
})
