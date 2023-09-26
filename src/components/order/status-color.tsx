const StatusColor = (status: string) => {
  let bg_class = 'bg-gray-100';
  if (
    status?.toLowerCase() === 'waiting-for-approval' ||
    status?.toLowerCase() === 'payment-pending'
  ) {
    bg_class = 'bg-slate-800';
  } else if (
    status?.toLowerCase() === 'approved-order' ||
    status?.toLowerCase() === 'payment-pending'
  ) {
    bg_class = 'bg-slate-900';
  } else if (
    status?.toLowerCase() === 'waiting-for-payment' ||
    status?.toLowerCase() === 'payment-pending'
  ) {
    bg_class = 'bg-slate-1000';
  } else if (
    status?.toLowerCase() === 'paid-and-confirmed' ||
    status?.toLowerCase() === 'payment-success'
  ) {
    bg_class = 'bg-slate-1001';
  } else if (
    status?.toLowerCase() === 'in-process' ||
    status?.toLowerCase() === 'payment-failed'
  ) {
    bg_class = 'bg-slate-1002';
  } else if (status?.toLowerCase() === 'done') {
    bg_class = 'bg-slate-1003';
  } else if (status?.toLowerCase() === 'order-cancelled') {
    bg_class = 'bg-red-600';
  } else {
    bg_class = 'bg-accent';
  }

  return bg_class;
};

export default StatusColor;
