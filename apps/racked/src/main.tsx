import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import GroupPage from "./components/GroupPage";
import Header from "./components/Header";
import "./index.css";

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
