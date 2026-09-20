import { TypingContext, TypingStateActionType } from '../../store'
import AdvancedSetting from './AdvancedSetting'
import DataSetting from './DataSetting'
import SoundSetting from './SoundSetting'
import ViewSetting from '@/pages/Typing/components/Setting/ViewSetting'
import { Dialog, Tab, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Fragment, useContext, useState } from 'react'
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
        className={`flex items-center justify-center rounded p-[2px] text-lg text-indigo-500 outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white  ${
          isOpen && 'bg-indigo-500 text-white'
        }`}
        title="Open settings dialog"
      >
        <IconCog6Tooth className="icon" />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex w-full max-w-[50rem] flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-xl dark:bg-gray-800">
                  <div className="relative flex h-16 items-end justify-between rounded-t-lg border-b border-neutral-100 bg-stone-50 px-4 py-3 dark:border-neutral-700 dark:bg-gray-900 sm:h-22 sm:px-6">
                    <span className="text-2xl font-bold text-gray-600 sm:text-3xl">Settings</span>
                    <button type="button" onClick={() => setIsOpen(false)} title="Close dialog">
                      <IconX className="absolute right-4 top-4 cursor-pointer text-gray-400 sm:right-7 sm:top-5" />
                    </button>
                  </div>

                  <Tab.Group>
                    <div className="flex h-auto w-full flex-col md:h-120 md:flex-row">
                      <Tab.List className="flex w-full flex-row items-stretch space-x-1 overflow-x-auto border-b border-neutral-100 bg-stone-50 px-2 py-2 dark:border-transparent dark:bg-gray-900 md:h-full md:w-52 md:flex-col md:items-start md:space-x-0 md:space-y-3 md:overflow-visible md:border-b-0 md:border-r md:px-6 md:py-3">
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none md:h-14 md:w-full md:px-4',
                              selected && 'bg-gray-200 bg-opacity-50 dark:bg-gray-800',
                            )
                          }
                        >
                          <IconEar className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                          <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Sound settings</span>
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none md:h-14 md:w-full md:px-4',
                              selected && 'bg-gray-200 bg-opacity-50 dark:bg-gray-800',
                            )
                          }
                        >
                          <IconAdjustmentsHorizontal className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                          <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Advanced settings</span>
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none md:h-14 md:w-full md:px-4',
                              selected && 'bg-gray-200 bg-opacity-50 dark:bg-gray-800',
                            )
                          }
                        >
                          <IconEye className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                          <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Display settings</span>
                        </Tab>
                        <Tab
                          className={({ selected }) =>
                            classNames(
                              'flex h-11 min-w-max cursor-pointer items-center gap-2 rounded-lg px-3 py-2 ring-0 focus:outline-none md:h-14 md:w-full md:px-4',
                              selected && 'bg-gray-200 bg-opacity-50 dark:bg-gray-800',
                            )
                          }
                        >
                          <IconDatabaseCog className="mr-0 text-neutral-500 dark:text-neutral-300 md:mr-2" />
                          <span className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300 md:text-base">Data settings</span>
                        </Tab>
                      </Tab.List>

                      <Tab.Panels className="h-[min(28rem,60dvh)] w-full flex-1 overflow-y-auto md:h-full">
                        <Tab.Panel className="flex h-full w-full  focus:outline-none">
                          <SoundSetting />
                        </Tab.Panel>
                        <Tab.Panel className="flex h-full focus:outline-none">
                          <AdvancedSetting />
                        </Tab.Panel>
                        <Tab.Panel className="flex h-full focus:outline-none">
                          <ViewSetting />
                        </Tab.Panel>
                        <Tab.Panel className="flex h-full focus:outline-none">
                          <DataSetting />
                        </Tab.Panel>
                      </Tab.Panels>
                    </div>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
