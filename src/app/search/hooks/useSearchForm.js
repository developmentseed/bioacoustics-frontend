import { useState, useEffect } from 'react';
import { MAX_AUDIO_CLIP_LENGTH, RESULTS_MAX, RESULTS_PAGE_SIZE } from '@/settings';
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

  const pushToResults = (response) => {
    setResults(previousResults => {
      return [...previousResults, ...response].sort((a, b) => a.distance - b.distance);
    });
  };

  const fetchResults = (page, embeddingPayload) => {
    const limit = RESULTS_PAGE_SIZE;
    const offset = page * limit;

    
    const formData  = new FormData();
    formData.append('embed', embeddingPayload);
    formData.append('limit', limit);
    formData.append('offset', offset);

    return fetch('https://api.bioacoustics.ds.io/api/v1/search/', {
      method: 'POST',
      body: formData,
    })
      .then(r => r.json())
      .then(pushToResults);
  };

  const fetchEmbedding = (audioUpload) => {
    const formData = new FormData();
    formData.append('audio_file', audioUpload, file.name);

    return fetch('https://api.bioacoustics.ds.io/api/v1/embed/', {
      method: 'POST',
      body: formData,
    })
      .then(r => r.json());
      .then(({ embedding }) => JSON.stringify(embedding)
  };

  /**
   * Submit the form
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setResults([]);

    const numPages = Math.ceil(RESULTS_MAX / RESULTS_PAGE_SIZE);
    const batchSize = 3;
    const audioUpload = await prepareAudioForUpload(file);
    const embedding = await fetchEmbedding(audioUpload);

    for (let pageOffset = 0; pageOffset < numPages; pageOffset += batchSize) {
      await Promise.all(
        Array(batchSize)
        .fill()
        .map((_, page) => {
          if (pageOffset + page < numPages) {
            return fetchResults(page + pageOffset, embeddingPayload);
          } else {
            return Promise.resolve(true);
          }
        }
      )).finally(() => setIsSubmitting(false));
    }
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
