export default function latLngEqual(a, b) {
  if (!a && !b) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return a[0] === b[0] && a[1] === b[1];
}
