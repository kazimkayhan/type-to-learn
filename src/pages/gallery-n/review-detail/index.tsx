import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import {
  currentChapterAtom,
  currentDictIdAtom,
  reviewModeInfoAtom,
} from "@/store";
import type { Dictionary } from "@/typings";
import { timeStamp2String } from "@/utils";
import {
  generateNewWordReviewRecord,
  useGetLatestReviewRecord,
} from "@/utils/db/review-record";
import MdiRobotAngry from "~icons/mdi/robot-angry";
import type { TErrorWordData } from "../hooks/use-error-words";

export function ReviewDetail({
  errorData,
  dict,
}: {
  errorData: TErrorWordData[];
  dict: Dictionary;
}) {
  const latestReviewRecord = useGetLatestReviewRecord(dict.id);
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom);
  const setCurrentDictId = useSetAtom(currentDictIdAtom);
  const navigate = useNavigate();
  const setCurrentChapter = useSetAtom(currentChapterAtom);

  const startReview = async () => {
    setCurrentDictId(dict.id);
    setCurrentChapter(-1);

    const record = await generateNewWordReviewRecord(dict.id, errorData);
    setReviewModeInfo({ isReviewMode: true, reviewRecord: record });
    navigate("/");
  };

  const continueReview = () => {
    setCurrentDictId(dict.id);
    setCurrentChapter(-1);

    setReviewModeInfo({ isReviewMode: true, reviewRecord: latestReviewRecord });
    navigate("/");
  };

  return (
    <div className="flex h-full flex-col items-center justify-around px-4 sm:px-10 lg:px-20">
      <div>
        <MdiRobotAngry className="text-primary" fontSize={30} />
        <blockquote>
          <p className="font-medium text-lg text-muted-foreground">
            We use your historical practice data, mistake counts, and practice
            time for this dictionary to intelligently generate a practice list.
            <br />
            This generation method is still experimental — we will continue to
            improve it.
          </p>
        </blockquote>
      </div>
      <div className="flex w-full flex-col items-center">
        {Boolean(latestReviewRecord) && (
          <>
            <div className="flex w-full items-center py-0 sm:ml-10">
              <Progress
                className="mr-4 w-full"
                max={latestReviewRecord.words.length}
                value={latestReviewRecord.index + 1}
              >
                <ProgressTrack className="h-2 rounded-full border border-primary bg-card">
                  <ProgressIndicator
                    className="h-full rounded-full bg-primary pl-0"
                    style={{
                      width: `calc(${((latestReviewRecord.index + 1) / latestReviewRecord.words.length) * 100}% )`,
                    }}
                  />
                </ProgressTrack>
              </Progress>
              <span className="p-0 text-xs">
                {latestReviewRecord.index + 1}/{latestReviewRecord.words.length}
              </span>
            </div>
            <div className="mt-1 font-normal text-muted-foreground text-sm">{`( Created ${timeStamp2String(latestReviewRecord.createTime)} )`}</div>
          </>
        )}

        {!latestReviewRecord && (
          <div>Current dictionary error words: {errorData.length}</div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-10">
          {Boolean(latestReviewRecord) && (
            <Button onClick={continueReview} size="sm">
              Continue current progress
            </Button>
          )}
          <Button onClick={startReview} size="sm">
            Start{latestReviewRecord && " new"} review
          </Button>
        </div>
      </div>
    </div>
  );
}
