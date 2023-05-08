export default function pause(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}
