import React, { useMemo } from 'react';
import { Tooltip, useMapEvents } from 'react-leaflet';
import DriftMarker from 'react-leaflet-drift-marker';
import usePrevious from '../../hooks/usePrevious.js';

const UserPin = ({ active, latLng, type, title = null, scale = 1.5, onChange }) => {
  const prevLatLng = usePrevious(latLng);

  const icon = useMemo(() => {
    return type === 'client' ? makeClientIcon(scale) : makeDriverIcon(scale);
  }, [type, scale]);

  useMapEvents({
    click(e) {
      if (active) {
        onChange([e.latlng.lat, e.latlng.lng]);
      }
    },
  });

  if (!latLng) {
    return null;
  }

  return (
    <DriftMarker
      position={latLng}
      icon={icon}
      duration={prevLatLng ? 500 : 0}
      options={{
        animate: true,
        duration: 0.5,
      }}
    >
      {title && (
        <Tooltip
          className={'rounded-md bg-white p-2 text-sm font-semibold text-gray-800 shadow-md'}
          permanent
          direction={'right'}
          offset={[16 * scale, -20 * scale]}
        >
          {title}
        </Tooltip>
      )}
    </DriftMarker>
  );
};

function makeClientIcon(scale) {
  return L.icon({
    iconUrl: '/user-pin.png',
    iconSize: [32 * scale, 32 * scale], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [16 * scale, 34 * scale], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  });
}

function makeDriverIcon(scale) {
  return L.icon({
    iconUrl: '/driver-pin.png',
    iconSize: [32 * scale, 32 * scale], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [16 * scale, 34 * scale], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
  });
}

export default UserPin;
