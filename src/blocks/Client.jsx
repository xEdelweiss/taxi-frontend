import Map from '../components/Map.jsx';
import Badge from '../components/shared/Badge.jsx';
import BottomPanel from '../components/shared/BottomPanel.jsx';
import OrderSetup from '../components/client/OrderSetup.jsx';
import UserPin from '../components/shared/UserPin.jsx';
import React, { useEffect, useState } from 'react';
import OrderTracking from '../components/client/OrderTracking.jsx';
import { cancelOrder, createOrder, fetchAddressByCoords, fetchOrder, fetchRoute, payOrder } from '../api.js';
import { Polyline, useMap } from 'react-leaflet';
import decodePolyline from '../utils/decodePolyline.js';
import { Wrapper } from '../components/shared/BlockWrapper.jsx';
import usePrevious from '../hooks/usePrevious.js';
import useLogin from '../hooks/useLogin.js';
import useTrackingHistory from '../hooks/useTrackingHistory.js';
import AddressInput from '../components/client/AddressInput.jsx';
import hashLatLng from '../utils/hashLatLng.js';
import latLngEqual from '../utils/latLngEqual.js';

const Client = () => {
  const { token, phone } = useLogin(
    'client',
    ({ order, latLng }) => {
      setOrder(order);
      setStartLatLng(latLng);
    },
    () => {
      setSelectedPoint('start');
      setStartLatLng(null);
      setStartAddress('');
      setFinishLatLng(null);
      setFinishAddress('');
      setRoute({
        polyline: null,
        boundingBox: null,
      });
      setOrder(null);
    },
  );

  const [selectedPoint, setSelectedPoint] = useState('start'); // start or finish

  const [startLatLng, setStartLatLng] = useState(null);
  const [finishLatLng, setFinishLatLng] = useState(null);

  const [locatedStartLatLng, setLocatedStartLatLng] = useState(null);
  const [startAddress, setStartAddress] = useState('');

  const [locatedFinishLatLng, setLocatedFinishLatLng] = useState(null);
  const [finishAddress, setFinishAddress] = useState('');

  const [route, setRoute] = useState({
    polyline: null,
    boundingBox: null,
  });

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (order?.id) {
        fetchOrder(order.id, token).then(setOrder);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [order?.id]);

  useTrackingHistory(startLatLng, token);

  useEffect(() => {
    if (!order) {
      return;
    }

    setStartLatLng([order.start.latitude, order.start.longitude]);
    setFinishLatLng([order.end.latitude, order.end.longitude]);

    setStartAddress(order.start.address);
    setFinishAddress(order.end.address);
  }, [order?.start, order?.end]);

  useEffect(() => {
    if (!startLatLng || !finishLatLng) {
      return;
    }

    fetchRoute(startLatLng, startAddress, finishLatLng, finishAddress, token).then(data => {
      setRoute({
        polyline: decodePolyline(data.polyline),
        boundingBox: data.boundingBox,
      });
    });
  }, [hashLatLng(startLatLng), hashLatLng(finishLatLng)]);

  const onCreateOrder = async () => {
    if (!token || !startLatLng || !finishLatLng) {
      return;
    }

    const newOrder = await createOrder(startLatLng, startAddress, finishLatLng, finishAddress, token);
    setOrder(newOrder);
  };

  const onPayOrder = async () => {
    await payOrder(order.id, token);

    const updatedOrder = await fetchOrder(order.id, token);
    setOrder(updatedOrder);
  };

  const onCancelOrder = async () => {
    await cancelOrder(order.id, 'client', token);
    setOrder(null);
  };

  useEffect(() => {
    if (token && startLatLng && !latLngEqual(startLatLng, locatedStartLatLng)) {
      fetchAddressByCoords(startLatLng, token).then(address => {
        setStartAddress(address ?? '');
        setLocatedStartLatLng(startLatLng);
      });
    }
  }, [startLatLng, token]);

  useEffect(() => {
    if (token && finishLatLng && !latLngEqual(finishLatLng, locatedFinishLatLng)) {
      fetchAddressByCoords(finishLatLng, token).then(address => {
        setFinishAddress(address ?? '');
        setLocatedFinishLatLng(finishLatLng);
      });
    }
  }, [finishLatLng, token]);

  return (
    <Wrapper token={token} phone={phone}>
      <Map onClick={e => console.log(e)}>
        <UserPin
          active={token && !order && selectedPoint === 'start'}
          type={'client'}
          title={'Start'}
          latLng={startLatLng}
          onChange={setStartLatLng}
        />
        <UserPin
          active={token && !order && selectedPoint === 'finish'}
          type={'client'}
          title={'Finish'}
          latLng={finishLatLng}
          onChange={setFinishLatLng}
        />

        {route?.polyline && <Polyline positions={route.polyline} />}

        <Scroller active startLatLng={startLatLng} finishLatLng={finishLatLng} route={route} />
      </Map>

      {phone && <Badge type={'client'} phone={phone} />}

      {token && (
        <BottomPanel>
          {!order && (
            <OrderSetup tripCost={order?.cost} onMakeOrderClick={onCreateOrder}>
              <AddressInput
                label="Start address:"
                value={startAddress}
                active={selectedPoint === 'start'}
                onChange={setStartAddress}
                onFocus={() => setSelectedPoint('start')}
                onFindClick={() => onFindClick('start')}
              />

              <AddressInput
                label="Finish address:"
                value={finishAddress}
                active={selectedPoint === 'finish'}
                onChange={setFinishAddress}
                onFocus={() => setSelectedPoint('finish')}
                onFindClick={() => onFindClick('finish')}
              />
            </OrderSetup>
          )}
          {order && <OrderTracking order={order} onPayClick={onPayOrder} onCancelClick={onCancelOrder} />}
        </BottomPanel>
      )}
    </Wrapper>
  );
};

function Scroller({ active, startLatLng, finishLatLng, route }) {
  const map = useMap();
  const prevStartLatLng = usePrevious(startLatLng);

  useEffect(() => {
    if (!active || (!startLatLng && !finishLatLng)) {
      return;
    }

    if (!route?.polyline) {
      map.flyTo(startLatLng, map.getZoom(), {
        animate: prevStartLatLng !== null,
        duration: 0.5,
      });

      return;
    }

    const bounds = [
      [route.boundingBox.bottomLeft.latitude, route.boundingBox.bottomLeft.longitude],
      [route.boundingBox.topRight.latitude, route.boundingBox.topRight.longitude],
    ];

    map.flyToBounds(bounds, {
      animate: true,
      duration: 0.5,
      padding: [150, 150],
    });
  }, [active, hashLatLng(startLatLng), hashLatLng(finishLatLng), route]);

  return null;
}

export default Client;
