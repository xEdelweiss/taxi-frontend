import React from 'react';
import UserIcon from '../icons/user.svg?react';
import DriverIcon from '../icons/driver.svg?react';
import formatPhone from '../../utils/formatPhone.js';

const Badge = ({ type, phone }) => {
  const icon = type === 'client' ? <UserIcon /> : <DriverIcon />;
  const title = type === 'client' ? 'Client:' : 'Driver:';

  return (
    <div className="absolute right-4 top-4 z-10 flex gap-4 rounded-lg bg-white px-4 py-2">
      {icon}

      <div className="flex flex-col justify-center gap-1">
        <div className="text-xs font-semibold text-gray-500">{title}</div>
        <div className="text-nowrap text-sm font-semibold text-gray-800">
          {formatPhone(phone)}
        </div>
      </div>
    </div>
  );
};

export default Badge;
