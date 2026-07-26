import { octgearProduct } from "./octgear/product";
import type { ProductDefinition } from "./productTypes";

export const PRODUCT_CATALOG = [
  octgearProduct,
] as const satisfies readonly ProductDefinition[];
