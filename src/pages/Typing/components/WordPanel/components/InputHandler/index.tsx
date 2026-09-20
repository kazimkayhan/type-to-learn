import KeyEventHandler from '../KeyEventHandler'
import TextAreaHandler from '../TextAreaHandler'
import { useIsTouch } from '@/hooks/useMediaQuery'
import { currentDictInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'
import type { FormEvent } from 'react'
import { useMemo } from 'react'

export default function InputHandler({ updateInput }: { updateInput: (updateObj: WordUpdateAction) => void }) {
  const dictInfo = useAtomValue(currentDictInfoAtom)
  const isTouch = useIsTouch()

  const handler = useMemo(() => {
    const needsTextArea = isTouch || !['en', 'de', 'romaji'].includes(dictInfo.language)
    if (needsTextArea) {
      return <TextAreaHandler updateInput={updateInput} />
    }

    return <KeyEventHandler updateInput={updateInput} />
  }, [dictInfo.language, isTouch, updateInput])

  return <>{handler}</>
}
export type WordUpdateAction = WordAddAction | WordDeleteAction | WordCompositionAction

export type WordAddAction = {
  type: 'add'
  value: string
  event: FormEvent<HTMLTextAreaElement> | KeyboardEvent
}

export type WordDeleteAction = {
  type: 'delete'
  length: number
}

// composition api is not ready yet
export type WordCompositionAction = {
  type: 'composition'
  value: string
}
