import { saveAs } from "file-saver";
import type { FC } from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { idDictionaryMap } from "@/resources/dictionary";
import { wordListFetcher } from "@/utils/word-list-fetcher";

interface DropdownProps {
  renderRecords: any;
}

const DropdownExport: FC<DropdownProps> = ({ renderRecords }) => {
  const [isExporting, setIsExporting] = useState(false);

  const formatTimestamp = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`;
  };

  const handleExport = useCallback(
    async (bookType: string) => {
      setIsExporting(true);

      try {
        // 获取所有需要的词典数据
        const dictUrls: string[] = [];
        for (const item of renderRecords) {
          const dictInfo = idDictionaryMap[item.dict];
          if (dictInfo?.url && !dictUrls.includes(dictInfo.url)) {
            dictUrls.push(dictInfo.url);
          }
        }

        // 并行获取所有词典数据
        const dictDataPromises = dictUrls.map(async (url) => {
          try {
            const data = await wordListFetcher(url);
            return { data, url };
          } catch (error) {
            console.error(
              `Failed to fetch dictionary data from ${url}:`,
              error
            );
            return { data: [], url };
          }
        });

        const dictDataResults = await Promise.all(dictDataPromises);
        const dictDataMap = new Map(
          dictDataResults.map((result) => [result.url, result.data])
        );

        const ExportData: Array<{
          Word: string;
          Definition: string;
          Mistakes: number;
          Dictionary: string;
        }> = [];

        for (const item of renderRecords) {
          const dictInfo = idDictionaryMap[item.dict];
          let translation = "";

          if (dictInfo?.url && dictDataMap.has(dictInfo.url)) {
            const wordList = dictDataMap.get(dictInfo.url) || [];
            const word = wordList.find((w: any) => w.name === item.word);
            translation = word ? word.trans.join("; ") : "";
          }

          ExportData.push({
            Definition: translation,
            Dictionary: dictInfo?.name || item.dict,
            Mistakes: item.wrongCount,
            Word: item.word,
          });
        }

        let blob: Blob;

        if (bookType === "txt") {
          const content = ExportData.map(
            (item: any) => `${item.Word}: ${item.Definition}`
          ).join("\n");
          blob = new Blob([content], { type: "text/plain" });
        } else {
          const worksheet = XLSX.utils.json_to_sheet(ExportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
          const excelBuffer = XLSX.write(workbook, {
            bookType: bookType as XLSX.BookType,
            type: "array",
          });
          blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        }

        const timestamp = formatTimestamp(new Date());
        const fileName = `ErrorBook_${timestamp}.${bookType}`;

        if (blob && fileName) {
          saveAs(blob, fileName);
        }
      } catch (error) {
        console.error("Export failed:", error);
        toast.error("Export failed. Please try again.");
      } finally {
        setIsExporting(false);
      }
    },
    [renderRecords]
  );

  const handleExportXlsx = useCallback(() => {
    handleExport("xlsx");
  }, [handleExport]);

  const handleExportCsv = useCallback(() => {
    handleExport("csv");
  }, [handleExport]);

  return (
    <div className="z-10">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              className="my-btn-primary h-8 shadow transition hover:bg-indigo-600 disabled:opacity-50"
              disabled={isExporting}
              type="button"
            />
          }
        >
          {isExporting ? "Exporting..." : "Export"}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-1 rounded bg-indigo-500 text-white shadow-lg">
          <DropdownMenuItem
            className="cursor-pointer rounded px-4 py-2 hover:bg-indigo-400 focus:bg-indigo-600 focus:outline-none"
            disabled={isExporting}
            onClick={handleExportXlsx}
          >
            .xlsx
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded px-4 py-2 hover:bg-indigo-600 focus:bg-indigo-600 focus:outline-none"
            disabled={isExporting}
            onClick={handleExportCsv}
          >
            .csv
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DropdownExport;
