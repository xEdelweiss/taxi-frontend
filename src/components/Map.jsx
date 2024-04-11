import { MapContainer, TileLayer } from 'react-leaflet';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '../constants.js';

const Map = ({ children, center = DEFAULT_MAP_CENTER, zoom = DEFAULT_ZOOM }) => {
  return (
    <MapContainer className={'z-0 h-full'} center={center} zoom={zoom}>
      <TileLayer
        attribution={`<a target='_blank' href='https://www.flaticon.com/authors/freepik'>Freepik</a> <span aria-hidden="true">|</span> &copy; <a target='_blank' href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>`}
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {children}
    </MapContainer>
  );
};

export default Map;
