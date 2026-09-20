import { PUBLIC_BASE } from '@/utils'
import type { Word } from '@/typings'

export async function wordListFetcher(url: string): Promise<Word[]> {
  const response = await fetch(PUBLIC_BASE + url)
  const words: Word[] = await response.json()
  return words
}
