export default function formatMoney({ amount, currency }) {
  if (!amount) {
    return '';
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });

  return formatter.format(amount);
}
