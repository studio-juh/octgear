import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BuildGuidePage } from "../app/pages/BuildGuidePage";
import "../app/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BuildGuidePage />
  </StrictMode>,
);
