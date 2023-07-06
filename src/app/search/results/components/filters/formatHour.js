export default function formatHour(hour) {
  if (hour === 24) {
    return '00:00';
  }
  if (hour < 10) {
    return `0${hour}:00`;
  }
  return `${hour}:00`;
}
