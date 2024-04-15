import Map from '../components/Map.jsx';
import Badge from '../components/shared/Badge.jsx';
import UserPin from '../components/shared/UserPin.jsx';
import { useEffect, useState } from 'react';
import useLogin from '../hooks/useLogin.js';
import { Wrapper } from '../components/shared/BlockWrapper.jsx';
import BottomPanel from '../components/shared/BottomPanel.jsx';
import { useMap } from 'react-leaflet';
import usePrevious from '../hooks/usePrevious.js';
import useTrackingHistory from '../hooks/useTrackingHistory.js';
import hashLatLng from '../utils/hashLatLng.js';
import NoOrder from '../components/driver/NoOrder.jsx';
import { acceptOrder, fetchDriverProfile, updateProfile } from '../api.js';
import PendingOrder from '../components/driver/PendingOrder.jsx';

const Driver = () => {
  const { token, phone } = useLogin(
    'driver',
    ({ token, order, latLng }) => {
      setUserLatLng(latLng);
      setOrder(order);

      fetchDriverProfile(token).then(setProfile);
    },
    () => {
      setProfile(null);
      setOrder(null);
      setUserLatLng(null);
    },
  );

  const [userLatLng, setUserLatLng] = useState(null);
  const [profile, setProfile] = useState(null);

  const [order, setOrder] = useState(null);

  useTrackingHistory(userLatLng, token);

  const onChangeOnline = online => {
    updateProfile({ online }, token).then(setProfile);
  };

  const onAccept = () => {
    acceptOrder(order.id, token).then(order => setOrder(order));
  };

  const onReject = () => {
    throw new Error('Not implemented');
  };

  return (
    <Wrapper token={token} phone={phone}>
      <Map>
        <UserPin active={token} type={'driver'} latLng={userLatLng} onChange={setUserLatLng} />

        <Scroller active userLatLng={userLatLng} />
      </Map>

      {token && <Badge type={'driver'} phone={phone} />}

      {token && profile && (
        <BottomPanel>
          {!order && <NoOrder online={profile.online} onChangeOnline={onChangeOnline} />}
          {order && (
            order?.status === 'WAITING_FOR_DRIVER' ? (
              <PendingOrder order={order} onAccept={onAccept} onReject={onReject} />
            ) : (
              <div>
                {order.status}
              </div>
            )
          )}
        </BottomPanel>
      )}
    </Wrapper>
  );
};

function Scroller({ active, userLatLng }) {
  const map = useMap();
  const prevUserLatLng = usePrevious(userLatLng);

  useEffect(() => {
    if (!active || !userLatLng) {
      return;
    }

    map.flyTo(userLatLng, map.getZoom(), {
      animate: !!prevUserLatLng,
      duration: 0.5,
    });
  }, [active, hashLatLng(userLatLng), hashLatLng(prevUserLatLng)]);

  return null;
}

export default Driver;
