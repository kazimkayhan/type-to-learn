import Loading from "./components/loading";
import "./index.css";
import { isOpenDarkModeAtom } from "@/store";
import TypingPage from "./pages/typing";
import "animate.css";
import { useAtomValue } from "jotai";
import React, { lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

const TRAILING_SLASH_REGEX = /\/$/;
const AnalysisPage = lazy(() => import("./pages/analysis"));
const GalleryPage = lazy(() => import("./pages/gallery-n"));
const ErrorBook = lazy(() =>
  import("./pages/error-book").then((module) => ({ default: module.ErrorBook }))
);
const FriendLinks = lazy(() =>
  import("./pages/friend-links").then((module) => ({
    default: module.FriendLinks,
  }))
);
const MobilePage = lazy(() => import("./pages/mobile"));

function Root() {
  const darkMode = useAtomValue(isOpenDarkModeAtom);
  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <React.StrictMode>
      <BrowserRouter
        basename={
          import.meta.env.BASE_URL.replace(TRAILING_SLASH_REGEX, "") || "/"
        }
      >
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<TypingPage />} index />
            <Route element={<GalleryPage />} path="/gallery" />
            <Route element={<AnalysisPage />} path="/analysis" />
            <Route element={<ErrorBook />} path="/error-book" />
            <Route element={<FriendLinks />} path="/friend-links" />
            <Route element={<MobilePage />} path="/mobile" />
            <Route element={<Navigate to="/" />} path="/*" />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </React.StrictMode>
  );
}

const container = document.getElementById("root");

container && createRoot(container).render(<Root />);
