import React from 'react';
import classNames from 'classnames';

const OnlineIcon = ({ className, size = 'lg' }) => {
  const classes = classNames(className, {
    'w-7 h-7': size === 'lg',
    'w-5 h-5': size === 'sm',
    'w-4 h-4': size === 'xs',
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={classes}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      ></path>
    </svg>
  );
};

export default OnlineIcon;
