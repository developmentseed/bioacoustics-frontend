export default function formatDateTime(timestamp) {
  const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'long', timeZone: 'UTC' });
  return dateFormat.format(timestamp * 1000);
}
