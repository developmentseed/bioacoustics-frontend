import { useState, useCallback } from 'react';

import { MAX_AUDIO_LENGTH, MAX_AUDIO_SIZE } from '@/settings';
import getDuration from '@/utils/getDuration';

const validate = async (file) => {
  const duration = await getDuration(file);
  const errors = [];
  if (duration > MAX_AUDIO_LENGTH) {
    errors.push('The audio length exceeds the limit of 5 minutes. Upload a shorter recording.');
  }
  if (file.size > MAX_AUDIO_SIZE) {
    errors.push('The file size exceeds the limit of 1GB. Upload a smaller file.');
  }
  return errors;
};

export default function useUploadValidation(onValid) {
  const [ error, setError ] = useState();

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    const errors = await validate(file);
    if (errors.length > 0) {
      setError(<><b>{file.name}</b>&nbsp;{errors.join(' ')}</>);
    } else {
      onValid(file);
    }
  }, [onValid]);

  return {
    error,
    handleFileChange
  };
}
