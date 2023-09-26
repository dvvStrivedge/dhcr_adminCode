import { useCart } from '@/contexts/quick-cart/cart.context';
import { useTranslation } from 'next-i18next';
import ItemCard from './item-card';
import { EmptyCartIcon } from '@/components/icons/empty-cart';
import usePrice from '@/utils/use-price';
import { ItemInfoRow } from './item-info-row';
import { CheckAvailabilityAction } from '@/components/checkout/check-availability-action';
import ReactDatePicker from 'react-datepicker';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useMutation } from 'react-query';
import { orderClient } from '@/data/client/order';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { checkoutAtom, customerAtom, useWalletPointsAtom, verifiedResponseAtom, verifiedTokenAtom } from '@/contexts/checkout';
import { PaymentGateway } from '@/types';
import ValidationError from '@/components/ui/form-validation-error';

const UnverifiedItemList = () => {
  const { t } = useTranslation('common');
  const { items, total, isEmpty, resetCart } = useCart();
  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );
  const [totalAmount, setTotalAmount] = useState(total);
  const [diffDay, setDiffDays] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const tax = localStorage.getItem('tax');
  const router = useRouter();
  const [_, setVerifiedResponse] = useAtom(verifiedResponseAtom);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { price: subtotal } = usePrice(
    {
      amount: totalAmount,
    }
  );
  const { price: discountAmt } = usePrice(
    {
      amount: discountAmount,
    }
  );
  const { price: finalTotalPrice } = usePrice({
    amount: finalTotal
  })
  const { price: taxPrice } = usePrice({
    amount: (totalAmount * tax) / 100
  });
  const { mutate: verifyOrder, isLoading: loading } = useMutation(
    orderClient.checkAvailability,
    {
      onSuccess: (res) => {
        // go to purchase page
        setVerifiedResponse(res);
        // set local storage
        localStorage.setItem('cart_item', JSON.stringify({
          diffDay,
          totalAmount,
          discount,
          finalTotal,
          tax: totalAmount * tax / 100,
          startDate: startDate.toISOString().substring(0, 10),
          endDate: endDate.toISOString().substring(0, 10),
          discountAmount
        }));
      },
    }
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onChange = (dates: any[]) => {
    const [start, end] = dates;
    if (end) {
      setStartDate(start);
      setEndDate(end);
      // get difference in days
      const startDates = new Date(start);
      const endDates = new Date(end);
      const diffTime = Math.abs(endDates.getTime() - startDates.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDiffDays(diffDays);

      const totalAmount: any = total * diffDays;

      let totalDiscountAmount = 0;
      let discountPrice = 0;
      let dis = 0;
      let disc = 0;
      items.forEach((item) => {
        let itemPrice = item.price * item?.quantity * diffDays;
        if (diffDays >= 7 && diffDays < 30) {
          discountPrice = itemPrice - (itemPrice * item?.one_week_discount ?? 0) / 100;
          dis = (itemPrice * item?.one_week_discount ?? 0) / 100;
          setDiscount(item?.one_week_discount ?? 0)
        } else if (diffDays >= 30) {
          discountPrice =
            itemPrice - (itemPrice * item?.one_months_discount ?? 0) / 100;
          dis = (itemPrice * item?.one_months_discount ?? 0) / 100;
          setDiscount(item?.one_months_discount ?? 0)
        } else if (diffDays >= 3 && diffDays < 7) {
          discountPrice =
            itemPrice - (itemPrice * item?.three_days_discount ?? 0) / 100;
          dis = (itemPrice * item?.three_days_discount ?? 0) / 100;
          setDiscount(item?.three_days_discount ?? 0)
        }
        // discount price with tax
        totalDiscountAmount += discountPrice;
        // total dis amount when loop ends
        disc += dis;

      });
      // totalAmount = totalAmount - discount in percentage
      totalDiscountAmount =
        totalDiscountAmount + (totalAmount * tax) / 100;
      setDiscountAmount(disc);
      setFinalTotal(totalDiscountAmount);
      setTotalAmount(totalAmount);
    } else {
      setStartDate(start);
      setEndDate(end);
      // get difference in days
      const startDates = new Date(start);
      const endDates = new Date(start);
      const diffTime = Math.abs(endDates.getTime() - startDates.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      const totalAmount: any = total * diffDays;

      // use usePrice hook to format the totalAmount
      setTotalAmount(totalAmount);
    }
  };

  function verify() {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // check availability api call
    // convert start and end date to iso string

    verifyOrder({
      products_ids: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        from: startDate.toISOString().substring(0, 10),
        to: endDate.toISOString().substring(0, 10),
      })),
    });
  }


  useEffect(() => {
    // get difference in days
    const startDates = new Date(startDate);
    const endDates = new Date(endDate);
    const diffTime = Math.abs(endDates.getTime() - startDates.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setDiffDays(diffDays);
    let totalAmount: any = total * diffDays;
    // use usePrice hook to format the totalAmount
    let totalDiscountAmount = 0;
    let discountPrice = 0;
    let dis = 0;
    let disc = 0;
    items.forEach((item) => {
      let itemPrice = item.price * item.quantity * diffDays;
      if (diffDays >= 7 && diffDays < 30) {
        discountPrice = itemPrice - (itemPrice * item?.one_week_discount ?? 0) / 100;
        dis = (itemPrice * item?.one_week_discount ?? 0) / 100;
        setDiscount(item?.one_week_discount ?? 0)
      } else if (diffDays >= 30) {
        discountPrice =
          itemPrice - (itemPrice * item?.one_months_discount ?? 0) / 100;
        dis = (itemPrice * item?.one_months_discount ?? 0) / 100;
        setDiscount(item?.one_months_discount ?? 0)
      } else if (diffDays >= 3 && diffDays < 7) {
        discountPrice =
          itemPrice - (itemPrice * item?.three_days_discount ?? 0) / 100;
        dis = (itemPrice * item?.three_days_discount ?? 0) / 100;
        setDiscount(item?.three_days_discount ?? 0)
      }
      // discount price with tax
      totalDiscountAmount += discountPrice;
      // total dis amount when loop ends
      disc += dis;

    });
    // totalAmount = totalAmount - discount in percentage
    totalDiscountAmount =
      totalAmount + (totalAmount * tax) / 100;
    setDiscountAmount(disc);
    setFinalTotal(totalDiscountAmount);
    setTotalAmount(totalAmount);
  }, [items]);

  const onChangeDiscount = (value: any) => {

    setDiscount(value);
    let discountPrice = totalAmount - (totalAmount * value) / 100;
    setDiscountAmount((totalAmount * value) / 100);
    let totalDiscountAmount = 0;
    totalDiscountAmount += discountPrice;

    // totalAmount = totalAmount - discount in percentage
    totalDiscountAmount =
      totalDiscountAmount + (totalAmount * tax) / 100;

    setFinalTotal(totalDiscountAmount);
  }

  return (
    <div className="w-full">
      <div className="space-s-4 mb-4 flex flex-col items-center">
        <span className="text-base font-bold text-heading">
          {t('text-your-order')}
        </span>
      </div>
      <div className="flex flex-col border-b border-border-200 py-3">
        {isEmpty ? (
          <div className="mb-4 flex h-full flex-col items-center justify-center">
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              {t('text-no-products')}
            </h4>
          </div>
        ) : (
          items?.map((item) => <ItemCard item={item} key={item.id} />)
        )}
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex">
          <span className="w-56 mt-3">
            <p>Select Date</p>
          </span>
          <ReactDatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            monthsShown={2}
            className="bg-transparent pl-10"
            // disable past dates and current date
            minDate={
              new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
            }
            selectsRange
          />
        </div>
        <ItemInfoRow title={t('text-sub-total')} value={subtotal} />
        <ItemInfoRow title={t('text-number-of-days')} value={diffDay} />
        <div className="flex justify-between">
          <p className="text-sm text-body mt-3">{t('text-discount')}</p>
          <span className="text-sm text-body text-end"><input
            name="discount"
            type="number"
            className="px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12 text-right"
            value={discount}
            onChange={(e) => onChangeDiscount(e.target.value)}
          /></span>
        </div>

        <ItemInfoRow title={t('text-discount-amount')} value={discountAmt} />
        <ItemInfoRow
          title={t('text-tax')}
          value={taxPrice}
        />
        <ItemInfoRow
          title={t('text-total')}
          value={finalTotalPrice}
        />
        {/* <ItemInfoRow
          title={t('text-estimated-shipping')}
          value={t('text-calculated-checkout')}
        /> */}
      </div>
      <Button
        loading={loading}
        className="w-full mt-5"
        onClick={verify}
        disabled={isEmpty}
      >
        {t('text-check-availability')}
      </Button>
      {errorMessage && (
        <div className="mt-3">
          <ValidationError message={errorMessage} />
        </div>
      )}
    </div>
  );
};
export default UnverifiedItemList;
