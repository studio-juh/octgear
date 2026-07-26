import { t } from "../shared/i18n";
import type { ProductId } from "./productTypes";

const PRODUCT_MESSAGES = {
  octgear: {
    home: t.home.products.octgear,
    buildGuide: t.octgearBuildGuide,
  },
} satisfies Record<ProductId, object>;

export function getProductMessages(productId: ProductId) {
  return PRODUCT_MESSAGES[productId];
}
