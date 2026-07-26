import { createContext, useContext, type ReactNode } from "react";

import type { ProductDefinition } from "./productTypes";

const ProductContext = createContext<ProductDefinition | null>(null);

type ProductProviderProps = {
  product: ProductDefinition;
  children: ReactNode;
};

export function ProductProvider({ product, children }: ProductProviderProps) {
  return (
    <ProductContext.Provider value={product}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductDefinition() {
  const product = useContext(ProductContext);

  if (!product) {
    throw new Error("ProductProvider is required for this page");
  }

  return product;
}
