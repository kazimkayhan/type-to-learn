import { TypingContext, TypingStateActionType } from '../../store'
import AdvancedSetting from './AdvancedSetting'
import DataSetting from './DataSetting'
import SoundSetting from './SoundSetting'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import ViewSetting from '@/pages/Typing/components/Setting/ViewSetting'
import { useContext, useState } from 'react'
import IconCog6Tooth from '~icons/heroicons/cog-6-tooth-solid'
import IconEye from '~icons/heroicons/eye-solid'
import IconAdjustmentsHorizontal from '~icons/tabler/adjustments-horizontal'
import IconDatabaseCog from '~icons/tabler/database-cog'
import IconEar from '~icons/tabler/ear'
import IconX from '~icons/tabler/x'

export default function Setting() {
  const [isOpen, setIsOpen] = useState(false)
  const { dispatch } = useContext(TypingContext) ?? {}

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
    if (dispatch) {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={cn(
          'flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white',
          isOpen && 'bg-indigo-500 text-white',
        )}
        title="Open settings dialog"
      >
        <IconCog6Tooth className="icon" />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[50rem] p-0">
          <div className="relative flex h-16 items-end justify-between rounded-t-lg border-b border-neutral-100 bg-stone-50 px-4 py-3 dark:border-neutral-700 dark:bg-gray-900 sm:h-22 sm:px-6">
            <DialogTitle className="text-2xl font-bold text-gray-600 sm:text-3xl">Settings</DialogTitle>
            <button type="button" onClick={() => setIsOpen(false)} title="Close dialog" className="absolute right-4 top-4">
              <IconX className="cursor-pointer text-gray-400 sm:right-7 sm:top-5" />
            </button>
          </div>

          <Tabs defaultValue="sound" className="flex h-auto w-full flex-col md:h-120 md:flex-row">
            <TabsList className="flex w-full flex-row items-stretch space-x-1 overflow-x-auto border-b border-neutral-100 bg-stone-50 px-2 py-2 dark:border-transparent dark:bg-gray-900 md:h-full md:w-52 md:flex-col md:items-start md:space-x-0 md:space-y-3 md:overflow-visible md:border-b-0 md:border-r md:px-6 md:py-3">
              <TabsTrigger
                value="sound"
                className="flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none data-[state=active]:bg-gray-200 data-[state=active]:bg-opacity-50 dark:data-[state=active]:bg-gray-800 md:h-14 md:w-full md:px-4"
              >
                <IconEar className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Sound settings</span>
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none data-[state=active]:bg-gray-200 data-[state=active]:bg-opacity-50 dark:data-[state=active]:bg-gray-800 md:h-14 md:w-full md:px-4"
              >
                <IconAdjustmentsHorizontal className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Advanced settings</span>
              </TabsTrigger>
              <TabsTrigger
                value="display"
                className="flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none data-[state=active]:bg-gray-200 data-[state=active]:bg-opacity-50 dark:data-[state=active]:bg-gray-800 md:h-14 md:w-full md:px-4"
              >
                <IconEye className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Display settings</span>
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none data-[state=active]:bg-gray-200 data-[state=active]:bg-opacity-50 dark:data-[state=active]:bg-gray-800 md:h-14 md:w-full md:px-4"
              >
                <IconDatabaseCog className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Data settings</span>
              </TabsTrigger>
            </TabsList>

            <div className="h-[min(28rem,60dvh)] w-full flex-1 overflow-y-auto md:h-full">
              <TabsContent value="sound" className="flex h-full w-full focus:outline-none">
                <SoundSetting />
              </TabsContent>
              <TabsContent value="advanced" className="flex h-full focus:outline-none">
                <AdvancedSetting />
              </TabsContent>
              <TabsContent value="display" className="flex h-full focus:outline-none">
                <ViewSetting />
              </TabsContent>
              <TabsContent value="data" className="flex h-full focus:outline-none">
                <DataSetting />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
