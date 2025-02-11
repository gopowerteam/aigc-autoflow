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
  const Schema = z.object({
    title: z.string().describe('根据主题生成文章的英文标题'),
    sentences: z.array(
      z.object({
        english: z.string().describe('每句的英文原文'),
        chinese: z.string().describe('每句的英文原文对应的中文翻译'),
      }),
    ).describe('根据主题生成文章的句子列表'),
  })

  const llm = langchain.llm.withStructuredOutput(Schema)
  const chain = ChatPromptTemplate
    .fromTemplate(prompt)
    .pipe(llm)

  const result = await chain.invoke({
    topic,
  })

  const { data, success } = Schema.safeParse(result)

  if (success) {
    return {
      ...data,
      topic,
    }
  }
  else {
    throw new Error('生成失败')
  }
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
    modelName,
  })

  return generateEnglishText(langchain, topic, modelPrompt)
})
