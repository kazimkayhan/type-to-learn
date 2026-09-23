import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SITE } from "@/constants";

export const AuthorButton = () => (
  <a
    aria-label={`Visit ${SITE.author}'s website`}
    className="rounded-full focus-visible:ring-2 focus-visible:ring-ring"
    href={SITE.website}
    rel="noopener noreferrer"
    target="_blank"
    title={`Visit ${SITE.author}`}
  >
    <Avatar className="h-8 w-8 shadow-lg">
      <AvatarImage alt="" src={SITE.avatar} />
      <AvatarFallback>KK</AvatarFallback>
    </Avatar>
  </a>
);
