import type { ExtractTablesWithRelations } from 'drizzle-orm'
import { getTableName, sql } from 'drizzle-orm'
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import { PromptSchema } from '../schemas'

type TX = PgTransaction<NodePgQueryResultHKT, Record<string, never>, ExtractTablesWithRelations<Record<string, never>>>

export async function runPromptSeed(tx: TX) {
  // Clear Table Data
  await tx.execute(sql.raw(`TRUNCATE TABLE ${getTableName(PromptSchema)}`))

  const template = `你是一位优秀的博客作者。你撰写的博客在搜索引擎中排名靠前，因为你了解 SEO 以及如何使用高度相关和热门的关键字。你的博客文章信息丰富，可帮助用户实现他们所寻找的内容。
你将收到搜索博客文章的用户的查询。你将创建与他们的查询相匹配、有帮助且能回答或与他们所搜索的内容相关的博客文章。
仅使用博客文章进行回复。
读者的问题是: {input}`

  // Insert Table Data
  await tx.insert(PromptSchema).values([
    {
      template,
      tag: '默认',
    },
  ])
}
