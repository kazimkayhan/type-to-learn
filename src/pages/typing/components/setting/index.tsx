import { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ViewSetting from "@/pages/typing/components/setting/view-setting";
import IconCog6Tooth from "~icons/heroicons/cog-6-tooth-solid";
import IconEye from "~icons/heroicons/eye-solid";
import IconAdjustmentsHorizontal from "~icons/tabler/adjustments-horizontal";
import IconDatabaseCog from "~icons/tabler/database-cog";
import IconEar from "~icons/tabler/ear";
import { TypingContext, TypingStateActionType } from "../../store";
import AdvancedSetting from "./advanced-setting";
import DataSetting from "./data-setting";
import SoundSetting from "./sound-setting";

export default function Setting() {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch } = useContext(TypingContext) ?? {};

  function openModal() {
    setIsOpen(true);
    if (dispatch) {
      dispatch({ payload: false, type: TypingStateActionType.SET_IS_TYPING });
    }
  }

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        aria-label="Open settings"
        className={`flex items-center justify-center rounded p-[2px] text-lg text-primary outline-none transition-colors duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring ${
          isOpen && "bg-primary text-primary-foreground"
        }`}
        onClick={openModal}
        title="Open settings dialog"
      >
        <IconCog6Tooth className="icon" />
      </DialogTrigger>

      <DialogContent
        className="flex w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card p-0 shadow-xl sm:max-w-3xl"
        showCloseButton={true}
      >
        <div className="relative flex h-16 items-end justify-between rounded-t-lg border-border border-b bg-muted px-4 py-3 sm:h-20 sm:px-6">
          <DialogTitle className="font-bold text-foreground text-xl sm:text-2xl">
            Settings
          </DialogTitle>
        </div>

        <Tabs
          className="flex h-auto w-full flex-col md:h-[32rem] md:flex-row"
          defaultValue="sound"
        >
          <TabsList className="flex w-full flex-row items-stretch space-x-1 overflow-x-auto border-border border-b bg-muted px-2 py-2 md:h-full md:w-48 md:flex-col md:items-start md:space-x-0 md:space-y-2 md:overflow-visible md:border-r md:border-b-0 md:px-4 md:py-3">
            <TabsTrigger
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-bold text-muted-foreground text-sm hover:bg-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:w-full md:justify-start"
              value="sound"
            >
              <IconEar className="icon" />
              Sound
            </TabsTrigger>
            <TabsTrigger
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-bold text-muted-foreground text-sm hover:bg-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:w-full md:justify-start"
              value="advanced"
            >
              <IconAdjustmentsHorizontal className="icon" />
              Advanced
            </TabsTrigger>
            <TabsTrigger
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-bold text-muted-foreground text-sm hover:bg-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:w-full md:justify-start"
              value="view"
            >
              <IconEye className="icon" />
              View
            </TabsTrigger>
            <TabsTrigger
              className="flex h-10 flex-shrink-0 items-center justify-start gap-2 rounded-md px-3 font-bold text-muted-foreground text-sm hover:bg-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground md:w-full md:justify-start"
              value="data"
            >
              <IconDatabaseCog className="icon" />
              Data
            </TabsTrigger>
          </TabsList>

          <div className="h-[min(28rem,60dvh)] w-full flex-1 overflow-y-auto md:h-full">
            <TabsContent
              className="flex h-full w-full focus:outline-none"
              value="sound"
            >
              <SoundSetting />
            </TabsContent>
            <TabsContent
              className="flex h-full focus:outline-none"
              value="advanced"
            >
              <AdvancedSetting />
            </TabsContent>
            <TabsContent
              className="flex h-full focus:outline-none"
              value="view"
            >
              <ViewSetting />
            </TabsContent>
            <TabsContent
              className="flex h-full focus:outline-none"
              value="data"
            >
              <DataSetting />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
