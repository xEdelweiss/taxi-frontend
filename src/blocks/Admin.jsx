import { useCallback, useEffect, useState } from 'react';
import HamburgerIcon from '../components/icons/hamburger.svg?react';
import Map from '../components/Map';
import UserPin from '../components/shared/UserPin';
import formatPhone from '../utils/formatPhone';
import { addUser, fetchUsers, removeUser } from '../api';
import { DEFAULT_ADMIN_ZOOM } from '../constants.js';
import OfflineIcon from '../components/icons/OfflineIcon.jsx?react';
import OnlineIcon from '../components/icons/OnlineIcon.jsx?react';

const Admin = () => {
  const [showControls, setShowControls] = useState(true);
  const [users, setUsers] = useState([]);

  const onAddUser = useCallback(async type => {
    const user = await addUser(type);

    setUsers(cur => [...cur, user]);
  }, []);

  const onRemoveUser = useCallback(async user => {
    await removeUser(user.phone);
    setUsers(cur => cur.filter(item => item.phone !== user.phone));

    const eventName = user.type === 'client' ? 'client-removed' : 'driver-removed';
    const event = new CustomEvent(eventName, { detail: { phone: user.phone } });
    window.dispatchEvent(event);
  }, []);

  const onSelectUser = useCallback(user => {
    const eventName = user.type === 'client' ? 'client-selected' : 'driver-selected';
    const event = new CustomEvent(eventName, { detail: { phone: user.phone } });
    window.dispatchEvent(event);
  }, []);

  useEffect(() => {
    fetchUsers().then(users => {
      setUsers(users);

      const client = users.find(user => user.type === 'client');
      const driver = users.find(user => user.type === 'driver');

      if (client) {
        onSelectUser(client);
      }

      if (driver) {
        onSelectUser(driver);
      }
    });

    const interval = setInterval(() => {
      fetchUsers().then(users => {
        setUsers(users);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={'h-full'}>
      <Map zoom={DEFAULT_ADMIN_ZOOM}>
        {users.map(user => (
          <UserPin
            key={user.phone}
            latLng={user.coordinates ? [user.coordinates.latitude, user.coordinates.longitude] : null}
            type={user.type}
          />
        ))}
      </Map>

      <ControlPanel
        active={showControls}
        users={users}
        onAddUser={onAddUser}
        onRemoveUser={onRemoveUser}
        onSelectUser={onSelectUser}
        onToggle={() => setShowControls(cur => !cur)}
      />
    </div>
  );
};

function ControlPanel({ active, users, onSelectUser, onAddUser, onRemoveUser, onToggle }) {
  const clients = users.filter(user => user.type === 'client');
  const drivers = users.filter(user => user.type === 'driver');

  return (
    <div className="w-content max-h-1/2 absolute right-0 top-0 z-10 overflow-hidden rounded-bl-md border-l border-t border-gray-300 bg-gray-100 shadow-lg">
      <div
        onClick={onToggle}
        className={`right-0 top-0 cursor-pointer bg-gray-100 bg-transparent p-4 text-right opacity-50 hover:opacity-100 ${active ? 'absolute' : ''}`}
      >
        <HamburgerIcon />
      </div>

      <div className={`p-4 ${active ? '' : 'hidden'}`}>
        <div className="flex w-full flex-col gap-2 xl:flex-row">
          {/* clients */}
          <section className="flex flex-col gap-y-3">
            <header className="text-md font-semibold">Clients</header>

            <ul className="my-0 flex flex-1 flex-col gap-y-2">
              {clients.map(client => (
                <li
                  key={client.phone}
                  onClick={() => onSelectUser(client)}
                  className="group flex cursor-pointer justify-between gap-4 rounded-md bg-white px-4 py-2 transition duration-300 hover:shadow-md"
                >
                  <div>
                    <div className="text-gray-600 group-hover:text-black">{formatPhone(client.phone)}</div>
                    <div className="text-xs text-gray-500">
                      {client.order?.id ? (
                        <span>
                          <span className="font-semibold text-black">Has order </span>
                          <span>
                            {' '}
                            [id: <span>{client.order.id}</span>]
                          </span>
                        </span>
                      ) : (
                        <span>No order</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveUser(client)}
                    className="rounded border border-red-500/50 px-4 py-2 text-xs font-semibold text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    X
                  </button>
                </li>
              ))}

              {clients.length === 0 && (
                <li className="flex justify-between gap-4 rounded-md bg-white px-4 py-2">
                  <div>
                    <div className="pr-[0.2rem]">No clients registered in app</div>
                    <div className="text-xs text-gray-500">Press "Add" to add new</div>
                  </div>
                </li>
              )}
            </ul>

            <div className="flex flex-row justify-start gap-2">
              <button
                onClick={() => onAddUser('client')}
                className="rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </section>

          {/* drivers */}
          <section className="flex flex-col gap-y-3">
            <header className="text-md font-semibold">Drivers</header>

            <ul className="my-0 flex flex-1 flex-col gap-y-2">
              {drivers.map(driver => (
                <li
                  key={driver.phone}
                  onClick={() => onSelectUser(driver)}
                  className="group flex cursor-pointer justify-between gap-4 rounded-md bg-white px-4 py-2 transition duration-300 hover:shadow-md"
                >
                  <div>
                    <div className="text-gray-600 group-hover:text-black">{formatPhone(driver.phone)}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {driver.driver_profile.online ? (
                        <OnlineIcon className={'text-blue-500/50'} size={'xs'} />
                      ) : (
                        <OfflineIcon className={'text-red-500/50'} size={'xs'} />
                      )}

                      {driver.order?.id ? (
                        <span>
                          <span className="font-semibold text-black">Has order </span>
                          <span>
                            {' '}
                            [id: <span>{driver.order.id}</span>]
                          </span>
                        </span>
                      ) : (
                        <span>No order</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveUser(driver)}
                    className="rounded border border-red-500/50 px-4 py-2 text-xs font-semibold text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
                  >
                    X
                  </button>
                </li>
              ))}

              {drivers.length === 0 && (
                <li className="flex justify-between gap-4 rounded-md bg-white px-4 py-2">
                  <div>
                    <div className="pr-[0.2rem]">No drivers registered in app</div>
                    <div className="text-xs text-gray-500">Press "Add" to add new</div>
                  </div>
                </li>
              )}
            </ul>

            <div className="flex flex-row justify-start gap-2">
              <button
                onClick={() => onAddUser('driver')}
                className="rounded bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </section>
        </div>

        <hr className="my-4" />

        {/* notes */}
        <ul className="ml-6 max-w-[425px] list-outside list-disc text-sm text-gray-800">
          <li>
            To <span className="font-semibold">login</span> as passenger or driver, click on the corresponding phone
            number.
          </li>
          <li>
            Passenger and Driver sections work with their <span className="font-semibold">individual API keys</span>.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Admin;
