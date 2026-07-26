import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DiagnosticsApp } from "../app/pages/DiagnosticsApp";
import { ProductProvider } from "../products/ProductContext";
import { octgearProduct } from "../products/octgear/product";
import "../app/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProductProvider product={octgearProduct}>
      <DiagnosticsApp />
    </ProductProvider>
  </StrictMode>,
);
