import DictionaryGroup from './CategoryDicts'
import DictRequest from './DictRequest'
import Layout from '@/components/Layout'
import { dictionaries } from '@/resources/dictionary'
import type { Dictionary } from '@/typings'
import groupBy, { groupByDictTags } from '@/utils/groupBy'
import { useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import IconInfo from '~icons/ic/outline-info'
import IconX from '~icons/tabler/x'

export default function GalleryPage() {
  const navigate = useNavigate()

  const groupedByCategoryAndTag = useMemo(() => {
    const groupedByCategory = Object.entries(groupBy(dictionaries, (dict) => dict.category))
    return groupedByCategory.map(([category, dicts]) => [category, groupByDictTags(dicts)] as [string, Record<string, Dictionary[]>])
  }, [])

  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  useHotkeys('enter,esc', onBack, { preventDefault: true })

  return (
    <Layout fillViewport={false}>
      <div className="relative mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-end gap-2 sm:mb-8">
          <div className="min-w-0">
            <DictRequest />
          </div>
          <button
            type="button"
            onClick={onBack}
            aria-label="Close dictionary gallery"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <IconX className="h-7 w-7" />
          </button>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-10 sm:gap-14">
          {groupedByCategoryAndTag.map(([category, groupeByTag]) => (
            <DictionaryGroup key={category} groupedDictsByTag={groupeByTag} />
          ))}
        </div>

        <div className="mt-12 flex items-start justify-center gap-2 px-1 pb-4 text-gray-500 sm:mt-16">
          <IconInfo className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="min-w-0 text-xs leading-relaxed">
            Dictionary data in this project comes from multiple open-source projects and voluntary community contributors. We are deeply
            grateful and respect the intellectual property of every contributor. This data is for personal learning and research only —
            commercial use is strictly prohibited. If you are a copyright owner and believe our use infringes your rights, please contact
            us via the email at the bottom of the site. Upon receiving a valid copyright complaint, we will remove the relevant content or
            seek necessary permission as soon as possible. We also encourage all users to respect copyright holders and comply with
            applicable laws when using this data. While we strive to ensure legality and accuracy, we make no guarantees regarding
            accuracy, completeness, legality, or reliability. Use of this data is entirely at your own risk.
          </p>
        </div>
      </div>
    </Layout>
  )
}
