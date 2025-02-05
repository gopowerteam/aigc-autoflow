import type { BaseFunctionCallOptions } from '@langchain/core/language_models/base'
import type { BaseChatModel } from '@langchain/core/language_models/chat_models'
import type { BaseMessageChunk } from '@langchain/core/messages'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'

interface LangChainOptions {
  modelName: string
  temperature: number
  AIApiKey: string
  AIApiURL: string
}

export class LangChainService {
  private llm: BaseChatModel<BaseFunctionCallOptions, BaseMessageChunk>

  constructor(options: LangChainOptions) {
    this.llm = new ChatOpenAI({
      modelName: options.modelName,
      temperature: options.temperature,
      configuration: {
        apiKey: options.AIApiKey,
        baseURL: options.AIApiURL,
      },
    })
  }

  invoke(promptTemplate: string, input: Record<string, string>) {
    try {
      // Create Parse
      const parser = new StringOutputParser()
      // Create Prompt
      const prompt = ChatPromptTemplate.fromTemplate(promptTemplate)
      // Create Chain
      const chain = prompt.pipe(this.llm).pipe(parser)
      return chain.invoke(input)
    }
    catch (ex) {
      console.error(ex)
    }
  }
}
