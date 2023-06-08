export default function getDuration(file) {
  return new Promise((resolve) => {
    const audioUrl = URL.createObjectURL(file);
    const el = document.createElement('audio');
    el.setAttribute('src', audioUrl);
    el.setAttribute('preload', 'metadata');
    el.addEventListener('loadedmetadata', () => {
      resolve(el.duration);
    });
  });
}
