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
      className="nav-icon-btn"
      onClick={toErrorBook}
      title="View Error Book"
      type="button"
    >
      <IconBook className="icon" />
    </button>
  );
};

export default ErrorBookButton;
