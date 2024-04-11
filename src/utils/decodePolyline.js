import { decode } from '@googlemaps/polyline-codec';
import L from 'leaflet';

export default function decodePolyline(polyline) {
  return decode(polyline).map(([lat, lng]) => new L.LatLng(lat, lng));
}
