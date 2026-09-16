import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/g/:groupKey" element={<GroupPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
