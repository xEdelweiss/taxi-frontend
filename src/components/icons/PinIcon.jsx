import classNames from 'classnames';

const PinIcon = ({ className, size = 'lg' }) => {
  const classes = classNames(className, {
    'w-7 h-7': size === 'lg',
    'w-5 h-5': size === 'sm',
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      ></path>
    </svg>
  );
};

export default PinIcon;
