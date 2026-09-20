import { SITE } from '@/constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const AuthorButton = () => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <Avatar className="h-8 w-8 shadow-lg" onClick={() => window.open(SITE.website, '_blank')}>
            <AvatarImage src={SITE.avatar} alt={`${SITE.author} homepage`} />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent className="cursor-pointer" onClick={() => window.open(SITE.website, '_blank')}>
          <p>Visit {SITE.author} ❤️</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
