export default function formatDate(timestamp) {
  const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'long', timeZone: 'UTC' });
  return dateFormat.format(timestamp * 1000);
}
