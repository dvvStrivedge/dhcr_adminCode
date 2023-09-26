import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
  three_days_discount: number;
  one_week_discount: number;
  one_months_discount: number;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}
export function generateCartItem(item: Item, variation: Variation) {
  const {
    id,
    name,
    slug,
    image,
    price,
    sale_price,
    quantity,
    unit,
    is_digital,
    three_days_discount,
    one_week_discount,
    one_months_discount,
  } = item;

  if (!isEmpty(variation)) {
    return {
      id: `${id}.${variation.id}`,
      productId: id,
      name: `${name} - ${variation.title}`,
      slug,
      unit,
      is_digital,
      stock: variation.quantity,
      price: variation.sale_price ? variation.sale_price : variation.price,
      image: image?.thumbnail,
      variationId: variation.id,
    };
  }

  return {
    id,
    name,
    slug,
    unit,
    is_digital,
    image: image?.thumbnail,
    stock: quantity,
    price: sale_price ? sale_price : price,
    three_days_discount: three_days_discount ? three_days_discount : 0,
    one_week_discount: one_week_discount ? one_week_discount : 0,
    one_months_discount: one_months_discount ? one_months_discount : 0,
  };
}
