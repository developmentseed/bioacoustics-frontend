export default function getDuration(file) {
  return new Promise((resolve) => {
    const audioUrl = URL.createObjectURL(file);
    const el = new Audio();
    el.setAttribute('src', audioUrl);
    el.setAttribute('preload', 'metadata');
    el.addEventListener('loadedmetadata', () => {
      resolve(el.duration);
    });
    el.load();
  });
}
