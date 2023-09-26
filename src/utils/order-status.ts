import { PaymentStatus } from '@/types';

export const ORDER_STATUS1 = [
  { name: 'Order Pending', status: 'order-pending', serial: 1 },
  { name: 'Order Processing', status: 'order-processing', serial: 2 },
  {
    name: 'Order At Local Facility',
    status: 'order-at-local-facility',
    serial: 3,
  },
  {
    name: 'Order Out For Delivery',
    status: 'order-out-for-delivery',
    serial: 4,
  },
  { name: 'Waiting for approval', status: 'waiting-for-approval', serial: 5 },
  { name: 'Approved Order', status: 'approved-order', serial: 6 },
  { name: 'Waiting for Payment', status: 'waiting-for-payment', serial: 7 },
  { name: 'Paid and Confirmed', status: 'paid-and-confirmed', serial: 8 },
  { name: "In Process", status: "in-process", serial: 9 },
  { name: 'Done', status: 'done', serial: 10 },
  { name: 'Order Completed', status: 'order-completed', serial: 5 },
  { name: 'Order Cancelled', status: 'order-cancelled', serial: 5 },
  { name: 'Order Refunded', status: 'order-refunded', serial: 5 },
  { name: 'Order Failed', status: 'order-failed', serial: 5 },
];

// export const ORDER_STATUS = [
//   { name: 'Order Pending', status: 'order-pending', serial: 1 },
//   { name: 'Order Processing', status: 'order-processing', serial: 2 },
//   {
//     name: 'Order At Local Facility',
//     status: 'order-at-local-facility',
//     serial: 3,
//   },
//   {
//     name: 'Order Out For Delivery',
//     status: 'order-out-for-delivery',
//     serial: 4,
//   },
//   { name: 'Order Completed', status: 'order-completed', serial: 5 },
//   { name: 'Order Cancelled', status: 'order-cancelled', serial: 5 },
//   { name: 'Order Refunded', status: 'order-refunded', serial: 5 },
//   { name: 'Order Failed', status: 'order-failed', serial: 5 },
// ];

export const ORDER_STATUS = [
  { name: 'Waiting for approval', status: 'waiting-for-approval', serial: 1, color: 'slate-800'  },
  { name: 'Approved Order', status: 'approved-order', serial: 2, color: 'slate-900' },
  { name: 'Order Cancelled', status: 'order-cancelled', serial: 3, color: 'red-600' },
  { name: 'Waiting for Payment', status: 'waiting-for-payment', serial: 4, color: 'slate-1000' },
  { name: 'Paid and Confirmed', status: 'paid-and-confirmed', serial: 5, color: 'slate-1001' },
  { name: "In Process", status: "in-process", serial: 6, color: 'slate-1002' },
  { name: 'Done', status: 'done', serial: 7, color: 'slate-1003' },
];

export const filterOrderStatus = (
  currentOrderStatus: any,
  orderStatus: any[],
  paymentStatus: PaymentStatus,
  currentStatusIndex: number
) => {

  if (currentOrderStatus === 'order-cancelled') {
    return orderStatus.slice(0, 3);
  }

  if (currentOrderStatus !== 'order-cancelled') {
    orderStatus = orderStatus.filter(
      (status) => status.status !== 'order-cancelled'
    );
    let index = orderStatus.findIndex((status) => status.status === currentOrderStatus);
    if ([PaymentStatus.SUCCESS, PaymentStatus.COD].includes(paymentStatus)) {
      return currentStatusIndex > 5
        ? [...orderStatus.slice(0, 5), orderStatus[currentStatusIndex - 1]] : orderStatus.slice(0, 6);
    }
    return currentStatusIndex > 3
      ? [...orderStatus.slice(0, 2), orderStatus[currentStatusIndex]]
      : orderStatus.slice(0, 6);
  }


  // if ([PaymentStatus.SUCCESS, PaymentStatus.COD].includes(paymentStatus)) {

  //   return currentStatusIndex > 4
  //     ? [...orderStatus.slice(0, 5), orderStatus[currentStatusIndex - 1]]
  //     : orderStatus.slice(0, 6);
  // }

  // return currentStatusIndex > 4
  //   ? [...orderStatus.slice(0, 2), orderStatus[currentStatusIndex - 1]]
  //   : orderStatus.slice(0, 6);
};
