export default function hashLatLng(latLng) {
  return latLng?.[0] + 'x' + latLng?.[1];
}
