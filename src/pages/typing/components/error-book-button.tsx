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
      aria-label="View Error Book"
      className="flex items-center justify-center rounded p-[2px] text-lg text-primary outline-none transition-colors duration-300 ease-in-out hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
      onClick={toErrorBook}
      title="View Error Book"
      type="button"
    >
      <IconBook className="icon" />
    </button>
  );
};

export default ErrorBookButton;
