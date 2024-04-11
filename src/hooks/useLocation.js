import { useState } from 'react';

export function useLocation() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const empty = !latitude && !longitude;
  const hash = latitude + 'x' + longitude;
  const latLng = empty ? null : [latitude, longitude];

  const setLatLng = latLng => {
    if (!latLng) {
      setLatitude(null);
      setLongitude(null);
      return;
    }

    setLatitude(latLng[0]);
    setLongitude(latLng[1]);
  };

  return {
    empty,
    latitude,
    longitude,
    latLng,
    setLatitude,
    setLongitude,
    setLatLng,
    hash,
  };
}
