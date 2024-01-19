import { redirect } from 'next/navigation';
import { SEARCH_API } from '@/settings';

const recordings = [
  `${SEARCH_API}/a2o/audio_recordings/download/flac/966100?start_offset=2210&end_offset=2215`,
  `${SEARCH_API}/a2o/audio_recordings/download/flac/514500?start_offset=2020&end_offset=2025`,
  `${SEARCH_API}/a2o/audio_recordings/download/flac/501900?start_offset=6380&end_offset=6385`,
  `${SEARCH_API}/a2o/audio_recordings/download/flac/256800?start_offset=4035&end_offset=4040`,
  `${SEARCH_API}/a2o/audio_recordings/download/flac/548300?start_offset=750&end_offset=755`
];

export default function Random() {
  const index = Math.floor(Math.random() * recordings.length);
  redirect(`/search/?q=${encodeURIComponent(recordings[index])}`);
}
