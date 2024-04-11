import OnlineIcon from '../icons/OnlineIcon.jsx?react';
import OfflineIcon from '../icons/OfflineIcon.jsx?react';
import MainButton from '../shared/MainButton.jsx';

const NoOrder = ({ online, onChangeOnline }) => {
  return (
    <div className="flex justify-end gap-2">
      <MainButton
        fitContent
        color={online ? 'red' : 'green'}
        icon={online ? <OfflineIcon /> : <OnlineIcon />}
        title={online ? 'Go Offline' : 'Go Online'}
        onClick={() => onChangeOnline(!online)}
      />
    </div>
  );
};

export default NoOrder;
