import { useCallback, useMemo, useState } from "react";
import { recordShareAction } from "@/utils";
import IconShare2 from "~icons/tabler/share-2";
import SharePicDialog from "./share-pic-dialog";

export default function ShareButton() {
  const [isShowSharePanel, setIsShowSharePanel] = useState(false);

  const randomChoose = useMemo(
    () => ({
      picRandom: Math.random(),
      promoteRandom: Math.random(),
    }),
    []
  );

  const onClickShare = useCallback(() => {
    recordShareAction("open");
    setIsShowSharePanel(true);
  }, []);

  return (
    <>
      {Boolean(isShowSharePanel) && (
        <SharePicDialog
          randomChoose={randomChoose}
          setShowState={setIsShowSharePanel}
          showState={isShowSharePanel}
        />
      )}

      <button
        aria-label="Share your score"
        className="cursor-pointer rounded p-1 text-muted-foreground text-xl hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onClickShare}
        title="Share your score with friends"
        type="button"
      >
        <IconShare2 />
      </button>
    </>
  );
}
