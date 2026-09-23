import { useCallback, useState } from "react";
import InfoPanel from "@/components/info-panel";
import { SITE } from "@/constants";
import IconBook2 from "~icons/tabler/book-2";

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false);

  const onOpenPanel = useCallback(() => {
    setShowPanel(true);
  }, []);

  const onClosePanel = useCallback(() => {
    setShowPanel(false);
  }, []);

  return (
    <>
      {Boolean(showPanel) && (
        <InfoPanel
          buttonClassName="bg-primary hover:bg-primary/90"
          icon={IconBook2}
          iconClassName="text-primary bg-accent"
          onClose={onClosePanel}
          openState={showPanel}
          title="Want to add more dictionaries?"
        >
          <p className="text-muted-foreground text-sm">
            If you have some programming skills, check out our{" "}
            <a
              className="font-medium text-primary hover:text-primary/80"
              href={SITE.dictGuide}
              rel="noopener noreferrer"
              target="_blank"
            >
              dictionary contribution guide
            </a>{" "}
            and follow the instructions to contribute new dictionary content to
            the open-source project. Community contributions are welcome!
          </p>
        </InfoPanel>
      )}
      <button
        aria-label="How to add dictionaries"
        className="group flex min-h-11 max-w-full items-center justify-center space-x-2 rounded-lg border border-primary/30 bg-accent px-3 py-2.5 font-medium text-primary text-sm shadow-sm transition-all duration-200 hover:border-primary/50 hover:bg-accent/70 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:px-4"
        onClick={onOpenPanel}
        type="button"
      >
        <IconBook2 className="h-4 w-4" />
        <span>Find more dictionaries</span>
        <span className="transform transition-transform group-hover:translate-x-1">
          ✨
        </span>
      </button>
    </>
  );
}
