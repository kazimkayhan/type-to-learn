import Tooltip from '@/components/Tooltip'
import { Listbox, Transition } from '@headlessui/react'
import { currentChapterAtom, currentDictInfoAtom, isReviewModeAtom } from '@/store'
import range from '@/utils/range'
import { useAtom, useAtomValue } from 'jotai'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import IconCheck from '~icons/tabler/check'

export const DictChapterButton = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  const chapterCount = currentDictInfo.chapterCount
  const isReviewMode = useAtomValue(isReviewModeAtom)

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if (event.key === ' ') {
      event.preventDefault()
    }
  }
  return (
    <>
      <Tooltip content="Switch dictionary">
        <NavLink
          className="block max-w-[9.5rem] truncate rounded-lg px-2 py-2 text-base transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 sm:max-w-[16rem] sm:px-3 sm:text-lg"
          to="/gallery"
        >
          {currentDictInfo.name} {isReviewMode && 'Error Review'}
        </NavLink>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content="Switch chapter">
          <Listbox value={currentChapter} onChange={setCurrentChapter}>
            <div className="relative">
              <Listbox.Button
                onKeyDown={handleKeyDown}
                className="min-h-10 rounded-lg px-2 py-2 text-base transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 sm:px-3 sm:text-lg"
              >
                Chapter {currentChapter + 1}
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="listbox-options z-10 w-32">
                  {range(0, chapterCount, 1).map((index) => (
                    <Listbox.Option key={index} value={index}>
                      {({ selected }) => (
                        <div className="group flex cursor-pointer items-center justify-between">
                          {selected ? (
                            <span className="listbox-options-icon">
                              <IconCheck className="focus:outline-none" />
                            </span>
                          ) : null}
                          <span>Chapter {index + 1}</span>
                        </div>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </Tooltip>
      )}
    </>
  )
}
