import usePronunciationSound from '@/hooks/usePronunciation'
import Tooltip from '@/components/Tooltip'
import type { WordWithIndex } from '@/typings'
import { useCallback } from 'react'

export default function WordChip({ word }: { word: WordWithIndex }) {
  const { play, stop } = usePronunciationSound(word.name, false)

  const onClickWord = useCallback(() => {
    stop()
    play()
  }, [play, stop])

  return (
    <Tooltip content={word.trans}>
      <button
        className="word-chip select-all"
        type="button"
        onClick={onClickWord}
        title={`Read aloud ${word.name}`}
      >
        <span>{word.name}</span>
      </button>
    </Tooltip>
  )
}
