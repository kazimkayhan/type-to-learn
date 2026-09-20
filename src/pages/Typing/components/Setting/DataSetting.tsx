import styles from './index.module.css'
import { Progress, ProgressTrack, ProgressIndicator } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { ExportProgress, ImportProgress } from '@/utils/db/data-export'
import { exportDatabase, importDatabase } from '@/utils/db/data-export'
import { useCallback, useState } from 'react'

export default function DataSetting() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  const exportProgressCallback = useCallback(({ totalRows, completedRows, done }: ExportProgress) => {
    if (done) {
      setIsExporting(false)
      setExportProgress(100)
      return true
    }
    if (totalRows) {
      setExportProgress(Math.floor((completedRows / totalRows) * 100))
    }

    return true
  }, [])

  const onClickExport = useCallback(() => {
    setExportProgress(0)
    setIsExporting(true)
    exportDatabase(exportProgressCallback)
  }, [exportProgressCallback])

  const importProgressCallback = useCallback(({ totalRows, completedRows, done }: ImportProgress) => {
    if (done) {
      setIsImporting(false)
      setImportProgress(100)
      return true
    }
    if (totalRows) {
      setImportProgress(Math.floor((completedRows / totalRows) * 100))
    }

    return true
  }, [])

  const onStartImport = useCallback(() => {
    setImportProgress(0)
    setIsImporting(true)
  }, [])

  const onClickImport = useCallback(() => {
    importDatabase(onStartImport, importProgressCallback)
  }, [importProgressCallback, onStartImport])

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Export data</span>
            <span className={styles.sectionDescription}>
              Your practice data is currently <strong>stored locally only</strong>. If you need to use Type to Learn on different devices,
              browsers, or unofficial deployments, you must manually sync and back up your data. To preserve your progress and use upcoming
              data analysis and smart training features, we recommend backing up your data regularly.
            </span>
            <span className="pl-4 text-left text-sm font-bold leading-tight text-red-500">
              For your data security, please do not modify exported data files.
            </span>
            <div className="flex h-3 w-full items-center justify-start px-5">
              <Progress className="w-11/12" value={exportProgress}>
                <ProgressTrack className="translate-z-0 relative h-2 transform overflow-hidden rounded-full bg-gray-200">
                  <ProgressIndicator
                    className="cubic-bezier(0.65, 0, 0.35, 1) h-full w-full bg-indigo-400 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${100 - exportProgress}%)` }}
                  />
                </ProgressTrack>
              </Progress>
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${exportProgress}%`}</span>
            </div>

            <button
              className="my-btn-primary ml-4 disabled:bg-gray-300"
              type="button"
              onClick={onClickExport}
              disabled={isExporting}
              title="Export data"
            >
              Export data
            </button>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Import data</span>
            <span className={styles.sectionDescription}>
              Please note: importing data will <strong className="text-sm font-bold text-red-500"> completely overwrite </strong> your
              current data. Proceed with caution.
            </span>

            <div className="flex h-3 w-full items-center justify-start px-5">
              <Progress className="w-11/12" value={importProgress}>
                <ProgressTrack className="translate-z-0 relative h-2 transform overflow-hidden rounded-full bg-gray-200">
                  <ProgressIndicator
                    className="cubic-bezier(0.65, 0, 0.35, 1) h-full w-full bg-indigo-400 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${100 - importProgress}%)` }}
                  />
                </ProgressTrack>
              </Progress>
              <span className="ml-4 w-10 text-xs font-normal text-gray-600">{`${importProgress}%`}</span>
            </div>

            <button
              className="my-btn-primary ml-4 disabled:bg-gray-300"
              type="button"
              onClick={onClickImport}
              disabled={isImporting}
              title="Import data"
            >
              Import data
            </button>
          </div>
        </div>
      </div>
      <ScrollBar className="flex touch-none select-none bg-transparent" orientation="vertical" />
    </ScrollArea>
  )
}
