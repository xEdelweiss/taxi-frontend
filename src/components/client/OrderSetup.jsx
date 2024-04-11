import React from 'react';
import StartIcon from '../icons/start.svg?react';
import formatMoney from '../../utils/formatMoney.js';

const OrderSetup = ({ children, tripCost, onMakeOrderClick }) => {
  return (
    <div className={'flex justify-between gap-3'}>
      <div className="flex w-full flex-col gap-2">{children}</div>

      <button
        onClick={onMakeOrderClick}
        className="flex flex-col items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-800"
      >
        <div className="flex items-center gap-2">
          <span>Drive</span>
          <StartIcon />
        </div>

        {tripCost && <span className="text-xs opacity-75">{formatMoney(tripCost)}</span>}
      </button>
    </div>
  );
};

export default OrderSetup;
