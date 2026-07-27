import { t } from "../shared/i18n";
import type { ProductId } from "./productTypes";

export function getProductMessages(productId: ProductId) {
  const productMessages = {
    octgear: {
      home: t.home.products.octgear,
      buildGuide: t.octgearBuildGuide,
    },
  } satisfies Record<ProductId, object>;

  return productMessages[productId];
}
