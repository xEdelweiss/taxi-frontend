import classNames from 'classnames';
import PinIcon from '../icons/PinIcon.jsx';
import React from 'react';

export function StatusLine({ children, active }) {
  const classes = classNames('flex gap-2 w-full items-center', {
    'text-gray-800 font-semibold': active,
    'text-gray-400': !active,
  });

  return (
    <div className={classes}>
      <div className="py-1">
        <PinIcon size={'sm'} />
      </div>

      <div className="line-clamp-1 text-sm">{children}</div>
    </div>
  );
}
