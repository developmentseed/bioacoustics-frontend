export default function getAudioUrlfromImageUrl(imageUrl) {
  return imageUrl.replace('.png?', '.mp3?');
}
