import InfoPanel from '@/components/InfoPanel'
import { trackPromotionEvent } from '@/utils/trackEvent'
import { useCallback, useState } from 'react'
import IconBook2 from '~icons/tabler/book-2'

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false)

  const onOpenPanel = useCallback(() => {
    setShowPanel(true)
    trackPromotionEvent('promotion_event', {
      from: 'dict_request_button',
      action: 'open',
      action_detail: 'dict_request_button_open',
    })
  }, [])

  const onClosePanel = useCallback(() => {
    setShowPanel(false)
    trackPromotionEvent('promotion_event', {
      from: 'dict_request_panel',
      action: 'close',
      action_detail: 'dict_request_panel_close',
    })
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
              href="https://github.com/RealKai42/qwerty-learner/blob/master/docs/toBuildDict.md"
              className="mx-1 font-medium text-blue-500 hover:text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              dictionary contribution guide
            </a>
            and follow the instructions to contribute new dictionary content to the open-source project. Community contributions are welcome!
          </p>

          {/*
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm dark:from-gray-800 dark:to-gray-700">
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">🚀 Try QwertyLearner.ai</h4>
              <p className="mb-3 text-sm text-gray-600 dark:text-gray-300">
                Not a programmer? Want your own custom study dictionary? Simple to use — upload once and start practicing
                <br />
                <div className="my-2"></div>
                Then we recommend trying
                <span className="mx-1 font-semibold text-blue-600 dark:text-blue-400">QwertyLearner.ai</span>
                , developed and operated by the UK DeepLearningAI team
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>AI dictionaries</strong> — upload once, auto-generate definitions and parts of speech, and build a custom dictionary
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Article practice</strong> — custom article content to improve real-world skills
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Cloud sync</strong> — sync practice records and the error book across devices
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>Dictionary selection</strong> — more professional dictionaries
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  window.open('https://qwertylearner.ai', '_blank')
                  onClosePanel()
                }}
                className="mt-4 w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                🚀 Try QwertyLearner.ai
              </button>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
              <p>
                <strong>Note:</strong> QwertyLearner.ai is independently developed and operated by the UK DeepLearningAI team as a separate derivative of the open-source QwertyLearner. The open-source edition will remain open source.
              </p>
            </div>
            */}
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
