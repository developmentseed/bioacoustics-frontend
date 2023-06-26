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

const validatorAlt = async (file) => {
  const duration = await getDuration(file);
  if (duration > MAX_AUDIO_LENGTH) {
    return {
      code: 'Audio file too long',
      message: 'The audio length exceeds the limit of 5 minutes. Upload a shorter recording.',
    };
  }
  if (file.size > MAX_AUDIO_SIZE) {
    return {
      code:'File too large', 
      message: 'The file size exceeds the limit of 1GB. Upload a smaller file.'
    };
  }
  return null;
};

export default function useUploadValidation() {
  const [ error, setError ] = useState();

  const validator = useCallback(async (file) => {
    const errors = await validate(file);
    if (errors.length > 0) {
      setError(<><b>{file.name}</b>&nbsp;{errors.join(' ')}</>);
    } else {
      return null;
    }
  }, []);

  return {
    error,
    validator
  };
}
