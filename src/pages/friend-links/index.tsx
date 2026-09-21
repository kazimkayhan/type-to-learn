import type React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SITE } from "@/constants";
import Layout from "../../components/layout";

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
    <Layout fillViewport={false}>
      <div className="flex w-full flex-1 flex-col items-center px-4 pt-12">
        <div className="flex w-full max-w-md flex-grow flex-col items-center">
          <Link
            className="self-start text-indigo-500 text-sm hover:underline"
            to="/"
          >
            Back to practice
          </Link>
          <h1 className="mt-5 text-center font-bold text-lg dark:text-gray-50">
            Related links
          </h1>
          <div className="links flex w-full flex-col items-center gap-y-8 py-5">
            {links.map((link) => (
              <a
                className="linkItem flex w-full items-center overflow-hidden rounded-lg p-2 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-800"
                href={link.href}
                key={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Avatar className="mr-3" size="lg">
                  <AvatarImage alt="" src={link.imgSrc} />
                  <AvatarFallback>
                    {link.title
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
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
          <a
            className="text-indigo-500 hover:underline"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </Layout>
  );
};
