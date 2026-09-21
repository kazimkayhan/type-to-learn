import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { recordErrorBookAction } from "@/utils";
import IconBook from "~icons/bxs/book";

const ErrorBookButton = () => {
  const navigate = useNavigate();

  const toErrorBook = useCallback(() => {
    navigate("/error-book");
    recordErrorBookAction("open");
  }, [navigate]);

  return (
    <button
      className={
        "flex items-center justify-center rounded p-[2px] text-indigo-500 text-lg outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white"
      }
      onClick={toErrorBook}
      title="View Error Book"
      type="button"
    >
      <IconBook className="icon" />
    </button>
  );
};

export default ErrorBookButton;
