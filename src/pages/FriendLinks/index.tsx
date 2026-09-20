import Layout from '../../components/Layout'
import { SITE } from '@/constants'
import type React from 'react'

export const FriendLinks: React.FC = () => {
  const links = [
    {
      title: SITE.author,
      href: SITE.website,
      imgSrc: SITE.avatar,
      description: `${SITE.author}'s personal site — software engineering, React, Next.js, and TypeScript.`,
    },
  ]

  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col items-center px-4 pt-20">
        <div className="flex w-full max-w-md flex-grow flex-col items-center">
          <div className="mt-5 text-center text-lg font-bold dark:text-gray-50">Links</div>
          <div className="links flex w-full flex-col items-center gap-y-8 py-5">
            {links.map((link) => (
              <a
                key={link.href}
                title={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="linkItem flex w-full items-center overflow-hidden dark:text-gray-50"
              >
                <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  <img src={link.imgSrc} alt={link.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="pb-1 text-sm font-bold">{link.title}</div>
                  <div className="text-xs text-gray-500">{link.description}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-auto pb-5 text-center text-sm text-gray-500">
          Want to add a link? Contact{' '}
          <a href={`mailto:${SITE.email}`} className="text-blue-500">
            {SITE.email}
          </a>
        </div>
      </div>
    </Layout>
  )
}
