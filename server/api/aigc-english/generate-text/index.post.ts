import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { eq } from 'drizzle-orm'
import { z } from 'h3-zod'
import { SystemSettingFieldsEnum, SystemSettingSchema, SystemSettingScopesEnum } from '~/drizzle/schemas'
import { LangChainService } from '~/server/services/langchain'
import { defineAuthEventHandler } from '~/server/utils/define-auth-event-handler'

const PostSchema = z.object({
  topic: z.string(),
})

async function generateEnglishText(langchain: LangChainService, topic:     string) {
  // outputParser

  const schema = z.object({
    title: z.string().describe('根据主题生成文章标题'),
    sentences: z.array(z.object({
      english: z.string().describe("根据主题生成文章的句子的英文原文"),
      chinese: z.string().describe("根据主题生成文章的句子的英文原文对应的中文翻译"),
    })).describe('根据主题生成文章的句子列表'),
  })
  
  const structuredLlm = langchain.llm.withStructuredOutput(schema);
  
  const result  = await structuredLlm.invoke("请根据一下主题生成一篇英文短文，字数在80-100字左右, 在生成英文的同时我需要你帮我生成对应的中文译文。");
  console.log(result)
  return result 


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
    modelName:'gpt-3.5-turbo',
  })

  const result = generateEnglishText(langchain, topic)

  return {
    result,
  }
})
