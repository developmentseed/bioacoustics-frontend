import { useEffect, useState } from 'react';
import { usePrevious } from '@chakra-ui/react';

export default function useAudioPlayer(file) {
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ duration, setDuration ] = useState();
  const [ currentTime, setCurrentTime ] = useState(0);
  const [ audioElement, setAudioElement ] = useState();
  const previousAudioElement = usePrevious(audioElement);

  useEffect(() => {
    const audioUrl = URL.createObjectURL(file);
    const el = document.createElement('audio');
    el.setAttribute('src', audioUrl);
    el.setAttribute('preload', 'metadata');
    el.addEventListener('loadedmetadata', () => {
      setDuration(el.duration);
    });
    el.addEventListener('timeupdate', () => {
      setCurrentTime(el.currentTime);
    });
    el.addEventListener('ended', () => {
      setIsPlaying(false);
    });
    setAudioElement(el);
  }, [file]);

  // reset the player state when a new audio is loaded
  useEffect(() => {
    if (previousAudioElement) {
      previousAudioElement.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioElement, previousAudioElement]);
  
  const handlePlayButtonClick = () => {
    isPlaying ? audioElement.pause() : audioElement.play();
    setIsPlaying(prev => !prev);
  };

  const handleScubberChange = (val) => {
    audioElement.currentTime = val;
  };

  return {
    isPlaying,
    duration,
    currentTime,
    playButtonProps: {
      onClick: handlePlayButtonClick
    },
    scrubberProps: {
      value: currentTime,
      onChange: handleScubberChange
    }
  };
}
