import classNames from 'classnames';

export function Wrapper({ phone, token, children }) {
  const classes = classNames('relative h-full transition duration-300 ease-in-out', {
    'opacity-25': !token && !phone,
    'opacity-50': token && !phone,
  });

  return <div className={classes}>{children}</div>;
}
