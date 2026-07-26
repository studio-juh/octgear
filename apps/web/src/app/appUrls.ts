import type { ProductDefinition, ProductPage } from "../products/productTypes";

export const homeUrl = publicUrl("");

export function publicUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path}`;
}

export function productPageUrl(
  product: ProductDefinition,
  page: ProductPage,
) {
  return publicUrl(product.routes[page]);
}

export function productAssetUrl(path: string) {
  return publicUrl(path);
}
