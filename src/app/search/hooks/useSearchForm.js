import { useState, useEffect } from 'react';
import { MAX_AUDIO_CLIP_LENGTH } from '@/settings';
import { bufferToWave, getDuration } from '@/utils';

export default function useSearchForm() {
  const [ file, setFile ] = useState();
  const [ duration, setDuration ] = useState();
  const [ clipStart, setClipStart ] = useState();
  const [ clipLength, setClipLength ] = useState();

  const [ results, setResults ] = useState([]);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  /**
   * Read duration from file whenever a new file was selected
   */
  useEffect(() => {
    if (file) {
      getDuration(file).then(setDuration);
    } else { 
      setDuration();
    }
  }, [file]);
  const disableSubmit = isSubmitting || (duration > MAX_AUDIO_CLIP_LENGTH && !clipStart);

  /**
   * Handler to confirm the selected clip window
   */
  const setClip = (start, length) => {
    setClipStart(start);
    setClipLength(length);
  };

  /**
   * Returns the audio to upload either padded to 5 seconds
   * or clipped to 5 seconds
   */
  const prepareAudioForUpload = (file) => {
    const start = duration > MAX_AUDIO_CLIP_LENGTH ? clipStart : 0;
    const length = duration > MAX_AUDIO_CLIP_LENGTH ? clipLength : MAX_AUDIO_CLIP_LENGTH;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(reader.result);
        const cutBuffer = audioContext.createBuffer(
          audioBuffer.numberOfChannels,
          Math.floor(length * audioBuffer.sampleRate),
          audioBuffer.sampleRate
        );

        const startAt = Math.floor((start * audioBuffer.sampleRate));
        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
          const channelData = audioBuffer.getChannelData(i);
          const cutChannelData = cutBuffer.getChannelData(i);

          for (let j = 0; j < cutBuffer.length; j++) {
            cutChannelData[j] = channelData[startAt + j] || 0;
          }
        }

        resolve(bufferToWave(cutBuffer));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  /**
   * Submit the form
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setResults([]);

    const formData  = new FormData();
    const audioUpload = await prepareAudioForUpload(file);
    formData.append('audio_file', audioUpload, file.name);

    fetch('https://api.bioacoustics.ds.io/api/v1/search/', {
      method: 'POST',
      body: formData,
    })
      .then(r => r.json())
      .then(setResults)
      .finally(() => setIsSubmitting(false));
  };

  return {
    duration,
    file,
    setFile,
    results,
    isSubmitting,
    clipStart,
    setClip,
    submitButtonProps: {
      onClick: handleFormSubmit,
      isDisabled: disableSubmit
    }
  };
}
