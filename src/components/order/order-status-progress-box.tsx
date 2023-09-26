import ProgressBox from '@/components/ui/progress-box/progress-box';
import { filterOrderStatus, ORDER_STATUS } from '@/utils/order-status';

import { OrderStatus, PaymentStatus } from '@/types';

interface Props {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
}

const OrderStatusProgressBox = ({ paymentStatus, orderStatus }: Props) => {
  const currentStatusIndex = ORDER_STATUS.findIndex((o) => o.status === orderStatus) ?? 0;

  const filterStatus = filterOrderStatus(
    orderStatus,
    ORDER_STATUS,
    paymentStatus!,
    currentStatusIndex
  );

  return (
    <ProgressBox
      data={filterStatus}
      status={orderStatus!}
      filledIndex={orderStatus !== OrderStatus.CANCELLED && currentStatusIndex > 1
        ? currentStatusIndex - 1
        : currentStatusIndex === 0
          ? currentStatusIndex
          : currentStatusIndex}
    />
  );
};

export default OrderStatusProgressBox;
