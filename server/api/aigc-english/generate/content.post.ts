import type { LangChainService } from '~/server/services/langchain'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { eq } from 'drizzle-orm'
import { z } from 'h3-zod'
import { SystemSettingFieldsEnum, SystemSettingSchema, SystemSettingScopesEnum } from '~/drizzle/schemas'

const PostSchema = z.object({
  topic: z.string(),
})

async function generateContent(langchain: LangChainService, topic: string) {
  const Schema = z.object({
    title: z.object({
      english: z.string().describe('根据主题生成文章对应的英文标题'),
      chinese: z.string().describe('根据主题生成文章对应的中文标题'),
    }),
    sentences: z.array(
      z.object({
        english: z.string().describe('每段的英文内容'),
        chinese: z.string().describe('每段的英文内容对应的中文翻译'),
      }),
    ).describe('根据主题生成文章的分段列表'),
  })

  const llm = langchain.llm.withStructuredOutput(Schema)
  const prompt = ChatPromptTemplate.fromTemplate(`
    请根据指定的主题生成一篇英语短文，要求生成的内容通顺易懂，不要出现过于复杂的词汇，便于儿童理解。
    生成的每段内容长度应该在5-12单词之间，不要出现过长的段落。短文的总词汇量应该在150-200词之间。
    
    主题为：${topic}。
  `)

  const chain = prompt.pipe(llm)
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

export default defineEventHandler(async (event) => {
  const { topic } = await useSafeBody(event, PostSchema)

  const settings = await db.query.SystemSettingSchema.findMany({
    where: eq(SystemSettingSchema.scope, SystemSettingScopesEnum.AigcEnglish),
  })

  const modelName = settings.find(x => x.key === SystemSettingFieldsEnum.AigcEnglishModel)?.value

  if (!modelName) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Model or prompt is not found.',
    })
  }

  const langchain = await useLangchain({
    modelName,
  })

  return generateContent(langchain, topic)
})
