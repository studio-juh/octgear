import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { StartGuidePage } from "../app/pages/StartGuidePage";
import { ProductProvider } from "../products/ProductContext";
import { octgearProduct } from "../products/octgear/product";
import "../app/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductProvider product={octgearProduct}>
      <StartGuidePage />
    </ProductProvider>
  </StrictMode>,
);
