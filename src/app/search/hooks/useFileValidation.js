import { MAX_AUDIO_LENGTH } from '@/settings';
import { useEffect, useState } from 'react';

export default function useFileValidation(file, duration) {
  const [ error, setError ] = useState();

  useEffect(() => {
    const durationError = duration > MAX_AUDIO_LENGTH ? 'Audio file search is limited to 5 seconds. Please clip snippet to 5 seconds to search.' : '';
    setError(durationError);
  }, [file, duration]);


  return {
    error
  };
}
