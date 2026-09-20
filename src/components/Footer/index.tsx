import { DonatingCard } from '../DonatingCard'
import { StickerButton } from '../DonatingCard/components/StickerButton'
import redBookCode from '@/assets/redBook-code.jpg'
import InfoPanel from '@/components/InfoPanel'
import Tooltip from '@/components/Tooltip'
import { infoPanelStateAtom } from '@/store'
import type { InfoPanelType } from '@/typings'
import { recordOpenInfoPanelAction } from '@/utils'
import { useAtom } from 'jotai'
import type React from 'react'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import IconMail from '~icons/material-symbols/mail'
import IconCoffee2 from '~icons/mdi/coffee'
import IconXiaoHongShu from '~icons/my-icons/xiaohongshu'
import RiLinksLine from '~icons/ri/links-line'
import IconTwitter from '~icons/ri/twitter-fill'
import IconGithub from '~icons/simple-icons/github'
import IconVisualstudiocode from '~icons/simple-icons/visualstudiocode'
import IconWechat2 from '~icons/simple-icons/wechat'
import IconWechat from '~icons/tabler/brand-wechat'
import IconCoffee from '~icons/tabler/coffee'
import IconTerminal2 from '~icons/tabler/terminal-2'
import IconFlagChina from '~icons/twemoji/flag-china'

const Footer: React.FC = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)
  const navigate = useNavigate()

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      recordOpenInfoPanelAction(modalType, 'footer')
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }))
    },
    [setInfoPanelState],
  )

  return (
    <>
      <InfoPanel
        openState={infoPanelState.donate}
        title="Buy us a coffee"
        icon={IconCoffee}
        buttonClassName="bg-amber-500 hover:bg-amber-400"
        iconClassName="text-amber-500 bg-amber-100 dark:text-amber-300 dark:bg-amber-500"
        onClose={() => handleCloseInfoPanel('donate')}
      >
        <p className="indent-4 text-sm text-gray-500 dark:text-gray-300">
          Thank you for using Qwerty Learner. This site is maintained in spare time, and we need your help to keep providing high-quality
          service!
          <br />
          Your donation helps cover operating costs, improve features and design, and enhance the user experience.
          <br />
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          We believe that together we can make Qwerty Learner an even better learning platform, and your support gives us the motivation to
          keep going. Thank you!
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          As a thank-you for donations of 50 RMB or more, we will send 5 custom Qwerty stickers
          <span className="text-xs"> (Mainland China only)</span>. We hope you will share the joy with friends!
        </p>
        <div className="flex items-center justify-center py-2">
          <StickerButton className="" />
        </div>

        <DonatingCard />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.vsc}
        title="VSCode typing plugin"
        icon={IconTerminal2}
        buttonClassName="bg-sky-500 hover:bg-sky-400"
        iconClassName="text-sky-500 bg-sky-100 dark:text-sky-300 dark:bg-sky-500"
        onClose={() => handleCloseInfoPanel('vsc')}
      >
        <p className="text-sm text-gray-500  dark:text-gray-400">
          Based on community feedback, we built a VSCode extension that lets you start vocabulary practice with one click, anytime.
          You can enable it in any file — words appear in the status bar, and the plugin intercepts document input without affecting your
          original file.
        </p>
        <br /> <br />
        <a className="mr-5 underline dark:text-gray-300" href="https://github.com/RealKai42/qwerty-learner-vscode">
          GitHub project
        </a>
        <a className="underline dark:text-gray-300" href="https://marketplace.visualstudio.com/items?itemName=Kaiyi.qwerty-learner">
          VSCode extension link
        </a>
        <br />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.community}
        title="User feedback community"
        icon={IconWechat}
        buttonClassName="bg-green-500 hover:bg-green-400"
        iconClassName="text-green-500 bg-green-100 dark:text-green-300 dark:bg-green-500"
        onClose={() => handleCloseInfoPanel('community')}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Qwerty Learner is an open-source project dedicated to providing a high-quality, reliable typing practice tool.
          <br />
          Join our community to talk with the dev team, share feedback and suggestions, help us improve the product, and stay up to date on
          news and updates.
          <br />
          <br />
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          We believe good interaction and feedback from users is key to moving forward. We invite you to join our community and help build a
          better Qwerty Learner!
        </p>
        <br />
        <p className="text-sm text-gray-500  dark:text-gray-400">Thank you again for your support!</p>
        <br />
        <img className="ml-1 w-1/2 max-w-[12rem] sm:w-2/6 " src="https://qwerty.kaiyi.cool/weChat-group.png" alt="weChat-group" />
        <br />
      </InfoPanel>

      <InfoPanel
        openState={infoPanelState.redBook}
        title="Xiaohongshu community"
        icon={IconXiaoHongShu}
        buttonClassName="bg-red-500 hover:bg-red-400"
        iconClassName="text-red-500 bg-red-100 dark:text-red-600 dark:bg-red-500"
        onClose={() => handleCloseInfoPanel('redBook')}
      >
        <p className="text-sm text-gray-500  dark:text-gray-400">
          Qwerty Learner is an open-source project dedicated to providing a high-quality, reliable typing practice tool.
          <br />
          Follow us on Xiaohongshu for the latest updates, share your experience and suggestions, and help us improve the product.
          <br />
          <br />
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          We believe good interaction and feedback from users is key to moving forward. We invite you to follow our Xiaohongshu account and
          help build a better Qwerty Learner!
        </p>
        <br />
        <img className="ml-1 w-1/2 max-w-[14rem] sm:w-5/12 " src={redBookCode} alt="redBook" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tips: In Xiaohongshu, tap the menu (☰) in the top-left of Me, then Scan
        </p>
        <br />
      </InfoPanel>

      <footer
        className="mb-1 mt-3 flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 px-3 text-xs ease-in sm:mt-4 sm:text-sm"
        onClick={(e) => e.currentTarget.blur()}
      >
        <a href="https://github.com/RealKai42/qwerty-learner" target="_blank" rel="noreferrer" aria-label="Go to GitHub project page">
          <IconGithub fontSize={15} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100" />
        </a>

        <button
          className="cursor-pointer"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('redBook')
            e.currentTarget.blur()
          }}
          aria-label="Join our Xiaohongshu community"
        >
          <IconXiaoHongShu fontSize={14} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500" />
        </button>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('community')
            e.currentTarget.blur()
          }}
          aria-label="Join our WeChat user group"
        >
          <IconWechat2 fontSize={16} className="text-gray-500 hover:text-green-500 dark:text-gray-400 dark:hover:text-green-500" />
        </button>

        <a href="https://twitter.com/real_kai42" target="_blank" title="x" rel="noreferrer">
          <IconTwitter fontSize={16} className="text-gray-500 hover:text-[#1DA1F2] dark:text-gray-400 dark:hover:text-[#1DA1F2]" />
        </a>
        <button
          className="cursor-pointer focus:outline-none "
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
          aria-label="Consider donating"
        >
          <IconCoffee2 fontSize={16} className="text-gray-500 hover:text-amber-500 dark:text-gray-400 dark:hover:text-amber-500" />
        </button>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('vsc')
            e.currentTarget.blur()
          }}
          aria-label="Use Qwerty Learner VSCode extension"
        >
          <IconVisualstudiocode fontSize={14} className="text-gray-500 hover:text-sky-500 dark:text-gray-400 dark:hover:text-sky-500" />
        </button>

        <a
          href="mailto:me@kaiyi.cool"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.currentTarget.blur()}
          aria-label="Send email to me@kaiyi.cool"
        >
          <IconMail fontSize={16} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
        </a>
        <a rel="noreferrer" className="cursor-pointer focus:outline-none" onClick={() => navigate('/friend-links')} aria-label="View friend links">
          <RiLinksLine fontSize={14} className="text-gray-500 hover:text-indigo-400 dark:text-gray-400 dark:hover:text-indigo-400" />
        </a>

        <Tooltip content="China mainland mirror">
          <a href="https://kaiyiwing.gitee.io/qwerty-learner" target="_self" title="Go to China mainland mirror">
            <IconFlagChina fontSize={16} />
          </a>
        </Tooltip>

        <button
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
        >
          @ Qwerty Learner
        </button>

        <a
          className="hidden cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 sm:inline"
          href="https://beian.miit.gov.cn"
          target="_blank"
          rel="noreferrer"
        >
          鲁ICP备2022030649号
        </a>
        <span className="hidden select-none rounded bg-slate-200 px-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400 sm:inline">
          Build <span className="select-all">{LATEST_COMMIT_HASH}</span>
        </span>
      </footer>
    </>
  )
}

export default Footer
