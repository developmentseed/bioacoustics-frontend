export default function getDuration(file) {
  return new Promise((resolve) => {
    const audioUrl = URL.createObjectURL(file);
    const el = new Audio();
    const sourceElement = document.createElement('source');
    sourceElement.src = audioUrl;
    sourceElement.type = 'audio/wav';
    el.setAttribute('preload', 'metadata');
    el.appendChild(sourceElement);

    el.addEventListener('loadedmetadata', () => {
      resolve(el.duration);
    });
    el.load();
  });
}
