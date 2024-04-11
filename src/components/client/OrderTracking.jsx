import React, { useMemo } from 'react';
import PayIcon from '../icons/pay.svg?react';
import CancelIcon from '../icons/cancel.svg?react';
import MainButton from '../shared/MainButton.jsx';
import formatMoney from '../../utils/formatMoney.js';
import { StatusLine } from '../shared/StatusLine.jsx';

const OrderTracking = ({ order, onPayClick, onCancelClick }) => {
  const orderStep = useMemo(() => {
    if (['WAITING_FOR_DRIVER', 'DRIVER_ON_WAY', 'DRIVER_ARRIVED'].includes(order?.status)) {
      return 1;
    } else if (order?.status === 'COMPLETED') {
      return 2;
    }

    return 0;
  }, [order.status]);

  return (
    <div className={'flex justify-between gap-3'}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex flex-col">
          <StatusLine active={orderStep === 0}>
            {order.start.address}
            {order.status === 'WAITING_FOR_PAYMENT' && (
              <span className={'opacity-75'}> (Waiting for payment: {formatMoney(order.cost)})</span>
            )}
          </StatusLine>

          <StatusLine active={orderStep === 1}>
            {order.status === 'WAITING_FOR_DRIVER' && <span>Looking for a driver...</span>}
            {order.status === 'DRIVER_ON_WAY' && <span>Driver is on the way</span>}
            {order.status === 'DRIVER_ARRIVED' && <span>Driver has arrived</span>}
            {!['WAITING_FOR_DRIVER', 'DRIVER_ON_WAY', 'DRIVER_ARRIVED'].includes(order.status) && (
              <span>Driving...</span>
            )}
          </StatusLine>

          <StatusLine active={orderStep === 2}>{order.end.address}</StatusLine>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-2">
        {orderStep === 0 && <MainButton title={'Pay'} icon={<PayIcon />} onClick={onPayClick} />}

        <MainButton title={'Cancel'} color={'red'} icon={<CancelIcon />} onClick={onCancelClick} />
      </div>
    </div>
  );
};

export default OrderTracking;
