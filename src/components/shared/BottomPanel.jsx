import React from 'react';

const BottomPanel = ({ children }) => {
  return (
    <div
      className={
        'absolute bottom-4 left-4 right-4 z-10 rounded-lg bg-white p-4'
      }
    >
      {children}
    </div>
  );
};

export default BottomPanel;
