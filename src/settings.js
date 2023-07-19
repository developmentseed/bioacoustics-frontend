const ACCEPTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/flac',
  'audio/x-m4a',
  'audio/webm',
  'audio/mp4'
];
const MAX_AUDIO_CLIP_LENGTH = 5; // seconds
const MAX_AUDIO_SIZE = 1073741824; // 1GB
const MAX_AUDIO_LENGTH = 300; // seconds
const RESULTS_MAX = 16384;
const RESULTS_DISPLAY_PAGE_SIZE = 25;
const SEARCH_API = 'https://api.bioacoustics.ds.io/api/v1';
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGV2c2VlZCIsImEiOiJjbGpmOG5wOG8yNXVsM29wbTZkdWh2dnczIn0.hbIHh4NVESSlh6JKH3CMlw';

export {
  ACCEPTED_AUDIO_TYPES,
  MAX_AUDIO_CLIP_LENGTH,
  MAX_AUDIO_SIZE,
  MAX_AUDIO_LENGTH,
  RESULTS_MAX,
  RESULTS_DISPLAY_PAGE_SIZE,
  SEARCH_API,
  MAPBOX_TOKEN,
};
