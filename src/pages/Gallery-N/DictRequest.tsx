import InfoPanel from '@/components/InfoPanel'
import { SITE } from '@/constants'
import { useCallback, useState } from 'react'
import IconBook2 from '~icons/tabler/book-2'

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false)

  const onOpenPanel = useCallback(() => {
    setShowPanel(true)
  }, [])

  const onClosePanel = useCallback(() => {
    setShowPanel(false)
  }, [])

  return (
    <>
      {showPanel && (
        <InfoPanel
          openState={showPanel}
          title="Want to add more dictionaries?"
          icon={IconBook2}
          buttonClassName="bg-indigo-500 hover:bg-indigo-400"
          iconClassName="text-indigo-500 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-500"
          onClose={onClosePanel}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            If you have some programming skills, check out our
            <a
              href={SITE.dictGuide}
              className="mx-1 font-medium text-blue-500 hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              dictionary contribution guide
            </a>
            and follow the instructions to contribute new dictionary content to the open-source project. Community contributions are welcome!
          </p>
        </InfoPanel>
      )}
      <button
        type="button"
        onClick={onOpenPanel}
        className="group flex min-h-11 max-w-full items-center justify-center space-x-2 rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-3 py-2.5 text-sm font-medium text-indigo-600 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:from-indigo-100 hover:to-blue-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-indigo-400 dark:from-gray-800 dark:to-gray-700 dark:text-indigo-400 dark:hover:from-gray-700 dark:hover:to-gray-600 sm:px-4"
      >
        <IconBook2 className="h-4 w-4" />
        <span>Find more dictionaries</span>
        <span className="transform transition-transform group-hover:translate-x-1">✨</span>
      </button>
    </>
  )
}
