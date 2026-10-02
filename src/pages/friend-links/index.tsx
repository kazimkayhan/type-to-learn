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
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 pt-10 sm:pt-12">
        <div className="flex w-full flex-grow flex-col items-center">
          <Link
            className="self-start rounded-sm font-medium text-primary text-sm transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring"
            to="/"
          >
            Back to practice
          </Link>
          <h1 className="mt-6 text-pretty text-center font-semibold text-2xl text-foreground sm:text-3xl">
            Related links
          </h1>
          <div className="mt-6 flex w-full flex-col items-center gap-y-3">
            {links.map((link) => (
              <a
                className="flex w-full cursor-pointer items-center overflow-hidden rounded-lg p-3 text-foreground transition-colors duration-150 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
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
                  <div className="pb-1 font-semibold text-sm">{link.title}</div>
                  <div className="text-muted-foreground text-xs leading-relaxed">
                    {link.description}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-auto pb-6 text-center text-muted-foreground text-sm">
          Want to add a link? Contact{" "}
          <a
            className="rounded-sm text-primary transition-colors hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring"
            href={`mailto:${SITE.email}`}
          >
            {SITE.email}
          </a>
        </div>
      </div>
    </Layout>
  );
};
