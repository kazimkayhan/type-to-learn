import { TypingContext, TypingStateActionType } from '../../store'
import AdvancedSetting from './AdvancedSetting'
import DataSetting from './DataSetting'
import SoundSetting from './SoundSetting'
import ViewSetting from '@/pages/Typing/components/Setting/ViewSetting'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useContext, useState } from 'react'
import IconCog6Tooth from '~icons/heroicons/cog-6-tooth-solid'
import IconEye from '~icons/heroicons/eye-solid'
import IconAdjustmentsHorizontal from '~icons/tabler/adjustments-horizontal'
import IconDatabaseCog from '~icons/tabler/database-cog'
import IconEar from '~icons/tabler/ear'

export default function Setting() {
  const [isOpen, setIsOpen] = useState(false)
  const { dispatch } = useContext(TypingContext) ?? {}

  function openModal() {
    setIsOpen(true)
    if (dispatch) {
      dispatch({ type: TypingStateActionType.SET_IS_TYPING, payload: false })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={openModal}
        className={`flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white ${
          isOpen && 'bg-indigo-500 text-white'
        }`}
        title="Open settings dialog"
      >
        <IconCog6Tooth className="icon" />
      </DialogTrigger>

      <DialogContent className="flex w-full max-w-[50rem] flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-xl dark:bg-gray-800" showCloseButton={true}>
        <div className="relative flex h-16 items-end justify-between rounded-t-lg border-b border-neutral-100 bg-stone-50 px-4 py-3 dark:border-neutral-700 dark:bg-gray-900 sm:h-22 sm:px-6">
          <DialogTitle className="text-2xl font-bold text-gray-600 sm:text-3xl">Settings</DialogTitle>
        </div>

        <Tabs defaultValue="sound" className="flex h-auto w-full flex-col md:h-120 md:flex-row">
          <TabsList className="flex w-full flex-row items-stretch space-x-1 overflow-x-auto border-b border-neutral-100 bg-stone-50 px-2 py-2 dark:border-transparent dark:bg-gray-900 md:h-full md:w-52 md:flex-col md:items-start md:space-x-0 md:space-y-3 md:overflow-visible md:border-b-0 md:border-r md:px-6 md:py-3">
            <TabsTrigger
              value="sound"
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-sans text-sm font-bold text-gray-500 hover:bg-white data-[state=active]:bg-indigo-400 data-[state=active]:text-white dark:hover:bg-gray-800 md:w-full md:justify-start"
            >
              <IconEar className="icon" />
              Sound
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-sans text-sm font-bold text-gray-500 hover:bg-white data-[state=active]:bg-indigo-400 data-[state=active]:text-white dark:hover:bg-gray-800 md:w-full md:justify-start"
            >
              <IconAdjustmentsHorizontal className="icon" />
              Advanced
            </TabsTrigger>
            <TabsTrigger
              value="view"
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-sans text-sm font-bold text-gray-500 hover:bg-white data-[state=active]:bg-indigo-400 data-[state=active]:text-white dark:hover:bg-gray-800 md:w-full md:justify-start"
            >
              <IconEye className="icon" />
              View
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-sans text-sm font-bold text-gray-500 hover:bg-white data-[state=active]:bg-indigo-400 data-[state=active]:text-white dark:hover:bg-gray-800 md:w-full md:justify-start"
            >
              <IconDatabaseCog className="icon" />
              Data
            </TabsTrigger>
          </TabsList>

          <div className="h-[min(28rem,60dvh)] w-full flex-1 overflow-y-auto md:h-full">
            <TabsContent value="sound" className="flex h-full w-full focus:outline-none">
              <SoundSetting />
            </TabsContent>
            <TabsContent value="advanced" className="flex h-full focus:outline-none">
              <AdvancedSetting />
            </TabsContent>
            <TabsContent value="view" className="flex h-full focus:outline-none">
              <ViewSetting />
            </TabsContent>
            <TabsContent value="data" className="flex h-full focus:outline-none">
              <DataSetting />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
