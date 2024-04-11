import React from 'react';
import classNames from 'classnames';

const MainButton = ({ title, subtitle, color = 'green', icon, onClick, fitContent = false }) => {
  const classes = classNames('flex flex-col items-end justify-center gap-2 rounded-lg px-4 py-2 text-white', {
    'flex-1': !fitContent,
    'bg-green-600 hover:bg-green-800': color === 'green',
    'bg-orange-600 hover:bg-orange-800': color === 'orange',
    'bg-red-600 hover:bg-red-800': color === 'red',
  });

  return (
    <button className={classes} onClick={onClick}>
      <div className="flex items-center gap-2">
        <span>{title}</span>
        {icon}
      </div>

      {subtitle && <span className="w-full text-center text-xs opacity-75">{subtitle}</span>}
    </button>
  );
};

export default MainButton;
