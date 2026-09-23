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
      aria-label="View statistics"
      className="nav-icon-btn"
      onClick={toAnalysis}
      title="View statistics"
      type="button"
    >
      <ChartPie className="icon" />
    </button>
  );
};

export default AnalysisButton;
