export default function formatDate(date) {
  const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeZone: 'UTC' });
  return dateFormat.format(date.getTime());
}
