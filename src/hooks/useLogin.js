import { useEffect, useState } from 'react';
import { login } from '../api.js';

export default function useLogin(userType, onLogin, onReset) {
  const [phone, setPhone] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(null);
    onReset();

    if (!phone) {
      return;
    }

    login(phone).then(({ token, order, latLng }) => {
      setToken(token);
      onLogin({ token, order, latLng });
    });
  }, [phone]);

  useEffect(() => {
    const selectEventName = userType === 'client' ? 'client-selected' : 'driver-selected';
    const selectListener = e => {
      setPhone(e.detail.phone);
    };

    const removeEventName = userType === 'client' ? 'client-removed' : 'driver-removed';
    const removeListener = e => {
      if (phone === e.detail.phone) {
        setPhone(null);
      }
    };

    window.addEventListener(selectEventName, selectListener);
    window.addEventListener(removeEventName, removeListener);

    return () => {
      window.removeEventListener(selectEventName, selectListener);
      window.removeEventListener(removeEventName, removeListener);
    };
  }, [userType, phone, setPhone]);

  return {
    token,
    phone,
    setPhone,
  };
}
