import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { recordAnalysisAction } from "@/utils";
import ChartPie from "~icons/heroicons/chart-pie-solid";

const AnalysisButton = () => {
  const navigate = useNavigate();

  const toAnalysis = useCallback(() => {
    navigate("/analysis");
    recordAnalysisAction("open");
  }, [navigate]);

  return (
    <button
      className={
        "flex items-center justify-center rounded p-[2px] text-indigo-500 text-lg outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white"
      }
      onClick={toAnalysis}
      title="View statistics"
      type="button"
    >
      <ChartPie className="icon" />
    </button>
  );
};

export default AnalysisButton;
