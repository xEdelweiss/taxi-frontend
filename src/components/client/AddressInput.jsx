import React from 'react';
import classNames from 'classnames';
import PinIcon from '../icons/PinIcon';
import FindIcon from '../icons/find.svg?react';

const AddressInput = ({ label, value, active, onFindClick, onChange, onFocus }) => {
  const inputRef = React.useRef(null);
  const focusOnInput = () => inputRef.current.focus();

  return (
    <div
      onClick={focusOnInput}
      className="flex w-full gap-2 border-b border-gray-300 transition duration-300 ease-in-out focus-within:border-gray-500"
    >
      <Icon active={active} />

      <div className="flex w-full flex-col justify-around">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-md font-semibold text-gray-800">
          <input
            className="w-full bg-transparent focus:outline-none"
            ref={inputRef}
            aria-label="Address"
            type="text"
            value={value}
            onChange={onChange}
            onFocus={onFocus}
          />
        </div>
      </div>

      <FindButton onClick={onFindClick} />
    </div>
  );
};

function Icon({ active }) {
  const classes = classNames('cursor-pointer transition duration-300 ease-in-out', {
    'text-gray-800': active,
    'text-gray-300 hover:text-gray-600': !active,
  });

  return (
    <div className={'py-1'}>
      <PinIcon className={classes} />
    </div>
  );
}

function FindButton({ onClick }) {
  return (
    <button
      className="shrink-0 rounded-tl-lg rounded-tr-lg bg-white px-4 py-2 text-gray-800 hover:bg-gray-100"
      onClick={onClick}
    >
      <FindIcon />
    </button>
  );
}

export default AddressInput;
