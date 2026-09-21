import Loading from "./components/Loading";
import "./index.css";
import { isOpenDarkModeAtom } from "@/store";
import { ErrorBook } from "./pages/ErrorBook";
import { FriendLinks } from "./pages/FriendLinks";
import MobilePage from "./pages/Mobile";
import TypingPage from "./pages/Typing";
import "animate.css";
import { useAtomValue } from "jotai";
import React, { lazy, Suspense, useEffect } from "react";
import "react-app-polyfill/stable";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const AnalysisPage = lazy(() => import("./pages/Analysis"));
const GalleryPage = lazy(() => import("./pages/Gallery-N"));

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
        basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
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
