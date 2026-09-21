import { useAtom } from "jotai";
import { useCallback } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { defaultFontSizeConfig } from "@/constants";
import { fontSizeConfigAtom } from "@/store";
import styles from "./index.module.css";

export default function ViewSetting() {
  const [fontSizeConfig, setFontsizeConfig] = useAtom(fontSizeConfigAtom);

  const onChangeForeignFontSize = useCallback(
    (value: number[]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        foreignFont: value[0],
      }));
    },
    [setFontsizeConfig]
  );

  const onChangeTranslateFontSize = useCallback(
    (value: number[]) => {
      setFontsizeConfig((prev) => ({
        ...prev,
        translateFont: value[0],
      }));
    },
    [setFontsizeConfig]
  );

  const onResetFontSize = useCallback(() => {
    setFontsizeConfig({ ...defaultFontSizeConfig });
  }, [setFontsizeConfig]);

  return (
    <ScrollArea className="flex-1 select-none overflow-y-auto">
      <div className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Font settings</span>
            <div className={styles.block}>
              <span className={styles.blockLabel}>Word font</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  max={96}
                  min={20}
                  onValueChange={onChangeForeignFontSize}
                  step={4}
                  value={[fontSizeConfig.foreignFont]}
                />
                <span className="ml-4 w-10 font-normal text-gray-600 text-xs">
                  {fontSizeConfig.foreignFont}px
                </span>
              </div>
            </div>

            <div className={styles.block}>
              <span className={styles.blockLabel}>Definition font</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider
                  className="slider"
                  max={60}
                  min={14}
                  onValueChange={onChangeTranslateFontSize}
                  step={4}
                  value={[fontSizeConfig.translateFont]}
                />
                <span className="ml-4 w-10 font-normal text-gray-600 text-xs">
                  {fontSizeConfig.translateFont}px
                </span>
              </div>
            </div>
          </div>
          <button
            className="my-btn-primary ml-4 disabled:bg-gray-300"
            onClick={onResetFontSize}
            title="Reset font settings"
            type="button"
          >
            Reset font settings
          </button>
        </div>
      </div>
      <ScrollBar
        className="flex touch-none select-none bg-transparent"
        orientation="vertical"
      />
    </ScrollArea>
  );
}
