import type React from "react";
import { SITE } from "@/constants";
import Layout from "../../components/Layout";

export const FriendLinks: React.FC = () => {
  const links = [
    {
      description: `${SITE.author}'s personal site — software engineering, React, Next.js, and TypeScript.`,
      href: SITE.website,
      imgSrc: SITE.avatar,
      title: SITE.author,
    },
  ];

  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col items-center px-4 pt-20">
        <div className="flex w-full max-w-md flex-grow flex-col items-center">
          <div className="mt-5 text-center font-bold text-lg dark:text-gray-50">
            Links
          </div>
          <div className="links flex w-full flex-col items-center gap-y-8 py-5">
            {links.map((link) => (
              <a
                className="linkItem flex w-full items-center overflow-hidden dark:text-gray-50"
                href={link.href}
                key={link.href}
                rel="noopener noreferrer"
                target="_blank"
                title={link.title}
              >
                <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200">
                  <img
                    alt={link.title}
                    className="h-full w-full object-cover"
                    src={link.imgSrc}
                  />
                </div>
                <div className="flex-1">
                  <div className="pb-1 font-bold text-sm">{link.title}</div>
                  <div className="text-gray-500 text-xs">
                    {link.description}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-auto pb-5 text-center text-gray-500 text-sm">
          Want to add a link? Contact{" "}
          <a className="text-blue-500" href={`mailto:${SITE.email}`}>
            {SITE.email}
          </a>
        </div>
      </div>
    </Layout>
  );
};
