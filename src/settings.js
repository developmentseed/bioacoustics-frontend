const ACCEPTED_AUDIO_TYPES = ['.mp3', '.wav', '.flac', '.m4a'];
const ACCEPTED_FILE_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/flac': ['.flac'],
  'audio/mp4': ['.m4a'],
};
const MAX_AUDIO_CLIP_LENGTH = 5; // seconds
const MAX_AUDIO_SIZE = 1073741824; // 1GB
const MAX_AUDIO_LENGTH = 300; // seconds
const RESULTS_MAX = 16384;
const RESULTS_DISPLAY_PAGE_SIZE = 25;
const SEARCH_API = 'https://api.bioacoustics.ds.io/api/v1';

export {
  ACCEPTED_AUDIO_TYPES,
  ACCEPTED_FILE_TYPES,
  MAX_AUDIO_CLIP_LENGTH,
  MAX_AUDIO_SIZE,
  MAX_AUDIO_LENGTH,
  RESULTS_MAX,
  RESULTS_DISPLAY_PAGE_SIZE,
  SEARCH_API,
};
