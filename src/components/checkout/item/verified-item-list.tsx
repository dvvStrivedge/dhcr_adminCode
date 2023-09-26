import Coupon from '@/components/checkout/coupon';
import usePrice from '@/utils/use-price';
import { EmptyCartIcon } from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/contexts/quick-cart/cart.utils';
import { useAtom } from 'jotai';
import {
  checkoutAtom,
  couponAtom,
  customerAtom,
  discountAtom,
  payableAmountAtom,
  useWalletPointsAtom,
  verifiedResponseAtom,
  verifiedTokenAtom,
  walletAtom,
} from '@/contexts/checkout';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import Wallet from '@/components/checkout/wallet/wallet';
import { CouponType, PaymentGateway } from '@/types';
import { useSettingsQuery } from '@/data/settings';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '@/components/ui/button';
import ValidationError from '@/components/ui/form-validation-error';
import { useMutation } from 'react-query';
import { orderClient } from '@/data/client/order';
interface Props {
  className?: string;
}
const VerifiedItemList: React.FC<Props> = ({ className }) => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const { items, isEmpty: isEmptyCart, resetCart } = useCart();
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);
  const router = useRouter();
  const { mutate, isLoading } = useMutation(orderClient.create, {
    onSuccess: (res) => {
      // setVerifiedResponse(res);
      // routing to order page
      router.push(`/orders`);
    },
  });
  const [use_wallet_points] = useAtom(useWalletPointsAtom);
  const [{ payment_gateway, customer_contact }] = useAtom(checkoutAtom);
  const [token] = useAtom(verifiedTokenAtom);
  const [customer] = useAtom(customerAtom);
  const {
    // @ts-ignore
    settings: { options }
  } = useSettingsQuery({
    language: locale!,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cartItem = JSON.parse(localStorage.getItem('cart_item'));
  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id)
  );
  console.log("cartItem", cartItem);


  const { price: tax } = usePrice(
    verifiedResponse && {
      amount: cartItem?.tax ? cartItem.tax : (cartItem?.totalAmount * 21) / 100,
    }
  );

  const { price: finalTotal } = usePrice(
    verifiedResponse && {
      amount: cartItem?.finalTotal ?? 0,
    }
  )

  const { price: shipping } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.shipping_charge ?? 0,
    }
  );

  const base_amount = calculateTotal(available_items);
  const { price: sub_total } = usePrice(
    verifiedResponse && {
      amount: cartItem?.totalAmount ?? 0,
    }
  );
  const [totalAmount, setTotalAmount] = useState(sub_total);
  // Calculate Discount base on coupon type
  let calculateDiscount = 0;

  switch (coupon?.type) {
    case CouponType.PERCENTAGE:
      calculateDiscount = (base_amount * Number(discount)) / 100
      break;
    case CouponType.FREE_SHIPPING:
      calculateDiscount = verifiedResponse ? verifiedResponse.shipping_charge : 0
      break;
    default:
      calculateDiscount = Number(discount)
  }


  const { price: discountPrice } = usePrice(
    //@ts-ignore
    discount && {
      amount: Number(calculateDiscount),
    }
  );

  const { price: discountAmount } = usePrice(
    verifiedResponse && {
      amount: cartItem?.discountAmount ?? 0,
    }
  );
  let freeShippings = options?.freeShipping && Number(options?.freeShippingAmount) <= base_amount
  const totalPrice = verifiedResponse
    ? calculatePaidTotal(
      {
        totalAmount: base_amount,
        tax: verifiedResponse?.total_tax,
        shipping_charge: verifiedResponse?.shipping_charge,
      },
      Number(calculateDiscount)
    )
    : 0;
  const { price: total } = usePrice(
    verifiedResponse && {
      amount: totalPrice <= 0 ? 0 : totalPrice,
    }
  );

  const calculateDiscounts = (item: any) => {
    let itemPrice = item.price * item.quantity * cartItem?.diffDay;

    if (
      cartItem?.diffDay >= 7 &&
      cartItem?.diffDay < 30 &&
      item.one_week_discount &&
      item.one_months_discount &&
      item.three_days_discount
    ) {
      return (itemPrice * item.one_week_discount) / 100;
    } else if (cartItem?.diffDay >= 30) {
      return (itemPrice * item.one_months_discount) / 100;
    } else if (cartItem?.diffDay >= 3 && cartItem?.diffDay < 7) {
      return (itemPrice * item.three_days_discount) / 100;
    }
  };

  function handlePlaceOrder() {
    if (!customer_contact) {
      setErrorMessage('Contact Number Is Required');
      return;
    }
    if (!use_wallet_points && !payment_gateway) {
      setErrorMessage('Gateway Is Required');
      return;
    }
    resetCart();
    mutate({
      amount: cartItem?.totalAmount ?? 0,
      total: cartItem?.totalAmount ?? 0,
      paid_total: cartItem?.finalTotal ?? 0,
      discount: cartItem?.discountAmount ?? 0,
      sales_tax: cartItem?.tax ?? 0,
      products: items.map((item) => ({
        product_id: item.id,
        order_quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity * cartItem?.diffDay,
        discount: calculateDiscounts(item),
        from: cartItem?.startDate,
        to: cartItem?.endDate,
      })),

      customer_id: customer?.value,
      customer_contact: customer_contact,
      use_wallet_points: false,
      payment_gateway: use_wallet_points
        ? PaymentGateway.FULL_WALLET_PAYMENT
        : payment_gateway,
    });
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center mb-4 space-s-4">
        <span className="text-base font-bold text-heading">
          {t('text-your-order')}
        </span>
      </div>
      <div className="flex flex-col pb-2 border-b border-border-200">
        {!isEmptyCart ? (
          items?.map((item) => {
            const notAvailable = verifiedResponse?.unavailable_products?.find(
              (d: any) => d === item.id
            );
            return (
              <ItemCard
                item={item}
                key={item.id}
                notAvailable={!!notAvailable}
              />
            );
          })
        ) : (
          <EmptyCartIcon />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <ItemInfoRow title={t('text-sub-total')} value={sub_total} />
        <ItemInfoRow title={t('text-number-of-days')} value={cartItem?.diffDay} />
        <ItemInfoRow title={t('text-discount-amount')} value={discountAmount} />
        <ItemInfoRow title={t('text-tax')} value={tax} />

        {discount && coupon ? (
          <div className="flex justify-between">
            <p className="flex items-center gap-1 text-sm text-body me-2">{t('text-discount')} <span className='-mt-px text-xs font-semibold text-accent'>{coupon?.type === CouponType.FREE_SHIPPING && `(${t('text-free-shipping')})`}</span></p>
            <span className="flex items-center text-xs font-semibold text-red-500 me-auto">
              ({coupon?.code})
              <button onClick={() => setCoupon(null)}>
                <CloseIcon className="w-3 h-3 ms-2" />
              </button>
            </span>
            <span className="flex items-center gap-1 text-sm text-body">{calculateDiscount > 0 ? <span className='-mt-0.5'>-</span> : null} {discountPrice}</span>
          </div>
        ) : (
          <div className="mt-5 !mb-4 flex justify-between">
            <Coupon subtotal={base_amount} />
          </div>
        )}
        <div className="flex justify-between pt-3 border-t-4 border-double border-border-200">
          <p className="text-base font-semibold text-heading">
            {t('text-total')}
          </p>
          <span className="text-base font-semibold text-heading">{finalTotal}</span>
        </div>
      </div>
      {verifiedResponse && (
        <Wallet
          totalPrice={totalPrice}
          walletAmount={verifiedResponse.wallet_amount}
          walletCurrency={verifiedResponse.wallet_currency ?? '0.00'}
        />
      )}
      {use_wallet && !Boolean(payableAmount) ? null : (
        <PaymentGrid className="p-5 mt-10 border border-gray-200 bg-light" />
      )}
      <Button
        loading={isLoading}
        className="w-full mt-5"
        onClick={handlePlaceOrder}
      >{t('text-place-order')}</Button>
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </div>
  );
};

export default VerifiedItemList;
