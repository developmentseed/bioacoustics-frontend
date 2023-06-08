import { useMemo } from 'react';
import { MAX_AUDIO_CLIP_LENGTH } from '@/settings';

export default function useFileValidation(file, duration) {
  const clipLengthError = useMemo(() => {
    return duration > MAX_AUDIO_CLIP_LENGTH ? 'Audio file search is limited to 5 seconds. Please clip snippet to 5 seconds to search.' : '';
  }, [duration]);

  return {
    clipLengthError
  };
}
