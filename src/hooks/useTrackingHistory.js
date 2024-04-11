import { useEffect } from 'react';
import { saveLocation } from '../api.js';
import usePrevious from './usePrevious.js';
import hashLatLng from '../utils/hashLatLng.js';

export default function useTrackingHistory(latLng, token) {
  const prevLatLng = usePrevious(latLng);

  const shouldSave = latLng && prevLatLng && hashLatLng(latLng) !== hashLatLng(prevLatLng);

  useEffect(() => {
    if (!shouldSave) {
      return;
    }

    console.log('SAVING', latLng);

    saveLocation(latLng, token);
  }, [latLng, shouldSave, token]);
}
