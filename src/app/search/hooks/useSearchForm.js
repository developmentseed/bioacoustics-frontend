import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import {
  MAX_AUDIO_CLIP_LENGTH,
  MAX_AUDIO_LENGTH,
  MAX_AUDIO_SIZE,
  RESULTS_MAX,
  SEARCH_API,
  ACCEPTED_AUDIO_TYPES
} from '@/settings';
import { bufferToWave, getDuration } from '@/utils';
import { useAppState } from '../context/appState';

const ClipLengthConfig = {
  encode: (value) => {
    if (value === undefined) return;
    return value.toString();
  },
  decode: (value) => parseInt(value)
};
const ClipStartConfig = {
  encode: (value) => {
    if (value === undefined) return;
    return value.toString();
  },
  decode: (value) => parseFloat(value)
};

const validate = async (files) => {
  if (files.length > 1) {
    return 'Upload only one file at a time.';
  }

  const file = files[0];
  if (!ACCEPTED_AUDIO_TYPES.includes(file.type)) {
    return 'The uploaded file is not accepted. Upload an *.mp3, *.wav, *.flac, or *.m4a.';
  }

  if (file.size > MAX_AUDIO_SIZE) {
    return 'The file size exceeds the limit of 1GB. Upload a smaller file.';
  }

  const duration = await getDuration(file);
  if (duration > MAX_AUDIO_LENGTH) {
    return 'The audio length exceeds the limit of 5 minutes. Upload a shorter recording.';
  }

  return;
};

export default function useSearchForm() {
  const [file, setFile] = useState();
  const [duration, setDuration] = useState();
  const [clipStart, setClipStart] = useAppState('clipStart', ClipStartConfig);
  const [clipLength, setClipLength] = useAppState('clipLength', ClipLengthConfig);

  const [error, setError] = useState();
  const [results, setResults] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isInitializing, setIsInitializing] = useState(true);
  const [autoSearch, setAutoSearch] = useState(true);
  const searchParams = useSearchParams();
  const audioUrl = searchParams.get('q');
  const router = useRouter();

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
  const prepareAudioForUpload = useCallback((file) => {
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
  }, [clipLength, clipStart, duration]);

  const fetchResults = (embeddingPayload) => {
    const formData = new FormData();
    formData.append('embed', embeddingPayload);
    formData.append('limit', RESULTS_MAX);
    formData.append('metric_type', 'L2');

    return fetch(`${SEARCH_API}/search/`, {
      method: 'POST',
      body: formData,
    })
      .then(r => r.json());
  };

  const fetchEmbedding = (audioUpload, name) => {
    const formData = new FormData();
    formData.append('audio_file', audioUpload, name);

    return fetch(`${SEARCH_API}/embed/`, {
      method: 'POST',
      body: formData,
    })
      .then(r => r.json())
      .then(({ embedding }) => JSON.stringify(embedding));
  };

  /**
   * Submit the form
   */
  const handleFormSubmit = useCallback(async (e) => {
    e && e.preventDefault();
    setIsSubmitting(true);
    setResults([]);

    const audioUpload = await prepareAudioForUpload(file);
    const embedding = await fetchEmbedding(audioUpload, file.name);

    return fetchResults(embedding)
      .then(setResults)
      .finally(() => setIsSubmitting(false));
  }, [file, prepareAudioForUpload]);

  const submitButtonProps = useMemo(() => ({
    onClick: handleFormSubmit,
    isDisabled: disableSubmit
  }), [disableSubmit, handleFormSubmit]);

  /**
   * Event handler for file-select changes
   */
  const handleFileSelect = async (files) => {
    const error = await validate(files);

    if (error) {
      if (files.length > 1) {
        setError(error);
      } else {
        setError(<><b>{files[0].name}</b>&nbsp;{error}</>);
      }
    } else {
      setFile(files[0]);
    }
  };

  /**
   * Download the file referenced in query param `q` and initialise the form
   */
  useEffect(() => {
    if (!audioUrl) {
      setIsInitializing(false);
      setAutoSearch(false);
      return;
    }

    fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => setFile(new File([blob], audioUrl)))
      .catch(() => setError(`Unable to download the recording from ${audioUrl}`))
      .finally(() => setIsInitializing(false));
  }, [audioUrl, setFile]);

  /**
   * Automatically submit the form once it's initialised
   */
  useEffect(() => {
    if (audioUrl && duration && autoSearch && !submitButtonProps.isDisabled) {
      submitButtonProps.onClick();
      setAutoSearch(false);
    }
  }, [audioUrl, duration, submitButtonProps, autoSearch]);

  // Reset the state when a new file is selected
  useEffect(() => {
    setResults([]);
    setError();
    if (file) {
      getDuration(file).then(setDuration);
      if (file.name !== audioUrl) {
        router.replace('/search');
        setClipStart();
        setClipLength();
      }
    } else {
      setDuration();
    }
  }, [audioUrl, file, router, setClipLength, setClipStart]);

  return {
    isInitializing,
    duration,
    file,
    results,
    isSubmitting,
    clipStart,
    clipLength,
    setClip,
    submitButtonProps,
    handleFileSelect,
    error
  };
}
