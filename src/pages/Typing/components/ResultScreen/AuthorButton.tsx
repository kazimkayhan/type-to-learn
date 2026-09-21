import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SITE } from "@/constants";

export const AuthorButton = () => (
  <TooltipProvider delayDuration={100}>
    <Tooltip defaultOpen>
      <TooltipTrigger>
        <Avatar
          className="h-8 w-8 shadow-lg"
          onClick={() => window.open(SITE.website, "_blank")}
        >
          <AvatarImage alt={`${SITE.author} homepage`} src={SITE.avatar} />
          <AvatarFallback>KK</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent
        className="cursor-pointer"
        onClick={() => window.open(SITE.website, "_blank")}
      >
        <p>Visit {SITE.author} ❤️</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
