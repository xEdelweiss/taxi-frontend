import { API_URL, DEFAULT_USER_LAT_LNG } from './constants.js';

export async function login(phone, password = '!password!') {
  if (!phone) {
    throw new Error('No phone provided');
  }

  const { token } = await fetch(API_URL + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      password: '!password!',
    }),
  }).then(response => response.json());

  const userLocation = await fetchLocation(phone);
  const orders = await fetchOrders(token);

  return {
    token,
    latLng: userLocation?.coordinates
      ? [userLocation.coordinates.latitude, userLocation.coordinates.longitude]
      : DEFAULT_USER_LAT_LNG,
    order: orders[0] || null,
  };
}

export async function fetchRoute(fromLatLng, fromAddress, toLatLng, toAddress, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  const data = await fetch(API_URL + '/api/navigation/routes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      start: {
        latitude: fromLatLng[0],
        longitude: fromLatLng[1],
        address: fromAddress,
      },
      end: {
        latitude: toLatLng[0],
        longitude: toLatLng[1],
        address: toAddress,
      },
    }),
  }).then(response => response.json());

  return data;
}

export async function fetchOrders(token) {
  const { items: orders } = await fetch(API_URL + `/api/trip/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.json());

  return orders;
}

export async function fetchOrder(orderId, token) {
  const order = await fetch(API_URL + `/api/trip/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.json());

  return order;
}

async function fetchLocation(phone) {
  const { items: locations } = await fetch(API_URL + `/debug/last-location?phones[]=${phone}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(response => response.json());

  return locations.find(location => location.phone === phone);
}

export async function fetchUsers() {
  const { items } = await fetch(API_URL + '/debug/users').then(response => response.json());

  return items.sort((a, b) => {
    if (a.phone > b.phone) {
      return 1;
    }

    if (a.phone < b.phone) {
      return -1;
    }

    return 0;
  });
}

export async function addUser(type) {
  return await fetch(API_URL + '/debug/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type }),
  }).then(response => response.json());
}

export async function removeUser(phone) {
  return fetch(API_URL + '/debug/users', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ phone }),
  }).then(response => response.json());
}

export async function saveLocation(latLng, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  return fetch(API_URL + '/api/tracking/locations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      latitude: latLng[0],
      longitude: latLng[1],
    }),
  });
}

export async function createOrder(fromLatLng, fromAddress, toLatLng, toAddress, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  const data = await fetch(API_URL + '/api/trip/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      start: {
        latitude: fromLatLng[0],
        longitude: fromLatLng[1],
        address: fromAddress,
      },
      end: {
        latitude: toLatLng[0],
        longitude: toLatLng[1],
        address: toAddress,
      },
    }),
  }).then(response => response.json());

  return data;
}

export async function payOrder(orderId, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  return await fetch(API_URL + `/api/payment/holds`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      order_id: orderId,
    }),
  });
}

async function updateOrder(orderId, order, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  return await fetch(API_URL + `/api/trip/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(order),
  });
}

export async function cancelOrder(orderId, cancellerType, token) {
  return updateOrder(
    orderId,
    {
      status: cancellerType === 'client' ? 'CANCELED_BY_USER' : 'CANCELED_BY_DRIVER',
    },
    token,
  );
}

export async function acceptOrder(orderId, token) {
  return updateOrder(orderId, { status: 'DRIVER_ON_WAY' }, token);
}

export async function rejectOrder(orderId, token) {
  // @todo API need improvement
}

export async function fetchCoordsByAddress(address, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  const data = await fetch(API_URL + '/api/geolocation/coordinates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      address,
    }),
  }).then(response => response.json());

  if (!data) {
    throw new Error('Address not found');
  }

  return [data.latitude, data.longitude];
}

export async function fetchAddressByCoords(latLng, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  const data = await fetch(API_URL + '/api/geolocation/addresses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      latitude: latLng[0],
      longitude: latLng[1],
    }),
  }).then(response => response.json());

  return data.address;
}

export async function fetchDriverProfile(token) {
  if (!token) {
    throw new Error('No token provided');
  }

  return await fetch(API_URL + '/api/driver/me', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(response => response.json());
}

export async function updateProfile(profile, token) {
  if (!token) {
    throw new Error('No token provided');
  }

  return await fetch(API_URL + '/api/driver/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  }).then(response => response.json());
}
