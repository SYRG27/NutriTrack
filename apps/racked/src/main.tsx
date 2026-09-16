import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import GroupPage from "./components/GroupPage";
import Header from "./components/Header";
import "./index.css";

/* Served at /train with a hash router. Landing on /train with no hash at all
   leaves the router with nothing to match, which is what made the back button
   look broken. Give it one before React starts. */
if (!window.location.hash) {
  window.history.replaceState(null, "", `${window.location.pathname}#/`);
}

/**
 * Client-side navigation keeps the scroll position. Going from a long group
 * page to the much shorter home page therefore left the window scrolled past
 * the end of the new document — a blank screen with the sticky header out of
 * view, which reading as "back is broken" is entirely fair.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/g/:groupKey" element={<GroupPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
