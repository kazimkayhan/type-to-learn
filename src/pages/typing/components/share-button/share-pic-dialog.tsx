import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import shareImage1 from "@/assets/share-pic/image-1.png";
import shareImage2 from "@/assets/share-pic/image-2.png";
import shareImage3 from "@/assets/share-pic/image-3.png";
import shareImage4 from "@/assets/share-pic/image-4.png";
import shareImage5 from "@/assets/share-pic/image-5.png";
import shareImage6 from "@/assets/share-pic/image-6.png";
import shareImage7 from "@/assets/share-pic/image-7.png";
import shareImage8 from "@/assets/share-pic/image-8.png";
import shareImage9 from "@/assets/share-pic/image-9.png";
import keyboardSvg from "@/assets/share-pic/keyBackground.svg";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { currentChapterAtom, currentDictInfoAtom } from "@/store";
import { recordShareAction } from "@/utils";
import IconXMark from "~icons/heroicons/x-mark-solid";
import { useTypingContext } from "../../store";

const PIC_RATIO = 3;
const PIC_LIST = [
  shareImage1,
  shareImage2,
  shareImage3,
  shareImage4,
  shareImage5,
  shareImage6,
  shareImage7,
  shareImage8,
  shareImage9,
];
// Some of these are quirky on purpose — powered by ChatGPT
const PROMOTE_LIST = [
  {
    sentence: "So fast it feels like an extra hand on the keyboard",
    word: "Extra Hand",
  },
  { sentence: "Thunderous technique that wows the crowd", word: "Thunder" },
  {
    sentence: "Typing as fast as lightning streaking across the keyboard",
    word: "Lightning",
  },
  {
    sentence: "Fingers move with the force of a gale wind",
    word: "Gale Force",
  },
  {
    sentence: "Every keystroke hits the mark with perfect accuracy",
    word: "Bullseye",
  },
  {
    sentence: "Typing with the unstoppable momentum of a sprint",
    word: "Full Speed",
  },
  { sentence: "Swift typing, smooth as the wind", word: "Swift Wind" },
  {
    sentence: "Speed and precision in perfect harmony — not a single mistake",
    word: "Flawless",
  },
  {
    sentence: "Effortless technique, smooth as walking on flat ground",
    word: "Smooth",
  },
  {
    sentence: "Clever technique that catches you off guard",
    word: "Trickster",
  },
  { sentence: "Typing so fast it seems like magic", word: "Wizard" },
  { sentence: "Adaptable posture, flexible as a snake", word: "Flexible" },
  {
    sentence: "Typing as fast as a bird soaring over the keyboard",
    word: "Soaring",
  },
  { sentence: "Skilled technique, like a string of pearls", word: "Eloquent" },
  {
    sentence: "Speed and accuracy so high, nothing can stop you",
    word: "Unstoppable",
  },
  {
    sentence: "Excellent speed and precision — offense and defense combined",
    word: "All-Round",
  },
  {
    sentence: "Lively technique that brings every word to life",
    word: "Vivid",
  },
];

export interface SharePicDialogProps {
  randomChoose: {
    picRandom: number;
    promoteRandom: number;
  };
  setShowState: (showState: boolean) => void;
  showState: boolean;
}

export default function SharePicDialog({
  showState,
  setShowState,
  randomChoose,
}: SharePicDialogProps) {
  const { state } = useTypingContext();
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const currentChapter = useAtomValue(currentChapterAtom);

  const dialogFocusRef = useRef<HTMLButtonElement>(null);

  const shareImage = useMemo(
    () => PIC_LIST[Math.floor(randomChoose.picRandom * PIC_LIST.length)],
    [randomChoose.picRandom]
  );
  const promote = useMemo(
    () =>
      PROMOTE_LIST[
        Math.floor(randomChoose.promoteRandom * PROMOTE_LIST.length)
      ],
    [randomChoose.promoteRandom]
  );

  useEffect(() => {
    async function loadToPng() {
      const { toPng } = await import("html-to-image");

      if (imageRef.current) {
        const width = imageRef.current.offsetWidth;
        const height = imageRef.current.offsetHeight;
        toPng(imageRef.current, {
          canvasHeight: height * PIC_RATIO,
          canvasWidth: width * PIC_RATIO,
        }).then((url) => {
          setImageURL(url);
        });
      }
    }

    loadToPng();
  }, []);

  const handleDownload = useCallback(async () => {
    const { saveAs } = await import("file-saver");

    if (imageURL) {
      saveAs(imageURL, "type-to-learn.png");
      recordShareAction("download");
    }
  }, [imageURL]);

  const handleClose = useCallback(() => {
    setShowState(false);
  }, [setShowState]);

  return (
    <>
      <Dialog onOpenChange={(open) => !open && handleClose()} open={showState}>
        <DialogContent
          className="overflow-hidden rounded-xl bg-white dark:bg-gray-700"
          showCloseButton={false}
        >
          <div className="flex flex-col items-center justify-center p-6 pb-8 sm:pt-20 sm:pr-14 sm:pb-10 sm:pl-20">
            <button
              className="absolute top-4 right-4 sm:top-5 sm:right-7"
              onClick={handleClose}
              title="Close dialog"
              type="button"
            >
              <IconXMark className="h-6 w-6 text-gray-400" />
            </button>
            <div className="h-auto w-full max-w-[29rem] sm:h-152 sm:w-116">
              {imageURL ? (
                <img className="h-auto w-full" src={imageURL} />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-white border-solid">
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-50"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgb(129 140 248)"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </div>
            <button
              className="my-btn-primary mt-8 h-10 sm:mt-10 sm:mr-9"
              onClick={handleDownload}
              ref={dialogFocusRef}
              title="Save"
              type="button"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div style={{ left: "-999px", position: "absolute", zIndex: -1 }}>
        <div className="box-content w-85 bg-white p-4" ref={imageRef}>
          <div
            className="relative flex h-112 w-75 flex-col items-start justify-start rounded-xl shadow-lg"
            style={{ backgroundColor: "#F8F8FF" }}
          >
            <div className="w-full">
              <KeyboardPanel description={promote.word} />
              <div className="text-center text-gray-500 text-xs">
                {promote.sentence}
              </div>
              <div className="mx-4 mt-6 flex rounded-xl bg-white px-4 py-3 opacity-50 shadow-xl">
                <DataBox data={`${state.timerData.time}`} description="Time" />
                <DataBox
                  data={`${state.timerData.accuracy}%`}
                  description="Accuracy"
                />
                <DataBox data={`${state.timerData.wpm}`} description="WPM" />
              </div>
              <div className="mt-4 ml-5 self-start text-base text-gray-800">
                {currentDictInfo.name}
              </div>
              <div className="mt-2 ml-5 self-start text-gray-600 text-xs">{`Chapter ${currentChapter + 1}`}</div>
            </div>
            <div className="mt-auto mb-3 ml-5">
              <div className="text-xs">kazimkayhan.github.io/type-to-learn</div>
              <div className="mt-1 font-normal text-gray-400 text-xs">
                Word and muscle memory training for keyboard workers
              </div>
            </div>
            <div className="absolute -right-9 bottom-10">
              <img className="w-48" height={122} src={shareImage} width={186} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function DataBox({ data, description }: { data: string; description: string }) {
  return (
    <div className="flex w-20 flex-1 flex-col items-center justify-center">
      <span className="w-4/5 text-center font-normal text-base text-gray-600">
        {data}
      </span>
      <span className="pt-2 text-gray-400 text-xs">{description}</span>
    </div>
  );
}

function KeyboardPanel({ description }: { description: string }) {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-0">
      {description.split("").map((char, index) => (
        <KeyboardKey char={char} key={`${index}-${char}`} />
      ))}
    </div>
  );
}

function KeyboardKey({ char }: { char: string }) {
  return (
    <div className="relative -mx-1 h-18 w-18">
      <div className="absolute top-0 right-0 bottom-0 left-0">
        <img className="h-full w-full" src={keyboardSvg} />
      </div>
      <div className="absolute top-2.5 right-0 left-0 flex items-center justify-center">
        <span
          className="font-normal text-base text-white"
          style={{ fontSize: "20px", transform: "rotateX(30deg) " }}
        >
          {char}
        </span>
      </div>
    </div>
  );
}
