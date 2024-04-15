import AcceptIcon from '../icons/accept.svg?react';
import RejectIcon from '../icons/reject.svg?react';
import MainButton from '../shared/MainButton.jsx';
import formatMoney from '../../utils/formatMoney.js';
import React from 'react';
import { StatusLine } from '../shared/StatusLine.jsx';

const PendingOrder = ({ order, onAccept, onReject }) => {
  return (
    <div className="flex justify-between gap-2">
      <div className="flex flex-col gap-1">
        <StatusLine>
          {order.start.address}
          {order.status === 'WAITING_FOR_PAYMENT' && (
            <span className={'opacity-75'}> (Waiting for payment: {formatMoney(order.cost)})</span>
          )}
        </StatusLine>

        <StatusLine>{order.finish.address}</StatusLine>
      </div>

      <div className="flex justify-center gap-2">
        <MainButton fitContent color={'green'} icon={<AcceptIcon />} title={'Accept'} onClick={onAccept} />

        <MainButton fitContent color={'red'} icon={<RejectIcon />} title={'Reject'} onClick={onReject} />
      </div>
    </div>
  );
};

export default PendingOrder;
