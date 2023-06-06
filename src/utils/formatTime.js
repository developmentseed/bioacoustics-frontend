export default function formatTime(time) {
  const currentTimeInSeconds = Math.floor(time);
  let minutes = Math.floor(currentTimeInSeconds / 60).toString().padStart(2, '0');
  let seconds = (currentTimeInSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}
