import { useEffect, useState, useRef, useCallback } from 'react';
import { usePrevious } from '@chakra-ui/react';

export default function useAudioPlayer(audioUrl, clipStart, clipLength) {
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ duration, setDuration ] = useState();
  const [ currentTime, setCurrentTime ] = useState(0);
  const [ audioElement, setAudioElement ] = useState();
  const previousAudioElement = usePrevious(audioElement);
  const intervalRef = useRef();
  const maxTime = clipStart ? clipStart + clipLength : duration;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetTime = useCallback((time) => {
    audioElement.currentTime = time;
    setCurrentTime(time);
  }, [audioElement]);

  useEffect(() => {
    const el = document.createElement('audio');
    el.setAttribute('src', audioUrl);
    el.setAttribute('preload', 'metadata');
    el.addEventListener('loadedmetadata', () => {
      setDuration(el.duration);
    });

    el.addEventListener('ended', () => {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    });
    setAudioElement(el);
  }, [audioUrl]);

  // set the start time when a new clip is set
  useEffect(() => {
    if (audioElement && clipStart) resetTime(clipStart);
  }, [audioElement, clipStart, resetTime]);

  // reset the player state when a new audio is loaded
  useEffect(() => {
    if (previousAudioElement) {
      previousAudioElement.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioElement, previousAudioElement]);
  
  const handlePlayButtonClick = () => {
    if (isPlaying) {
      audioElement.pause();
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        if (audioElement.currentTime < maxTime) {
          setCurrentTime(audioElement.currentTime);
        } else {
          audioElement.pause();
          setIsPlaying(false);
          clearInterval(intervalRef.current);
        }
      }, 25);

      if (audioElement.currentTime >= maxTime && clipStart) {
        resetTime(clipStart);
      }
      audioElement.play();
    }
    setIsPlaying(prev => !prev);
  };

  const handleScubberChange = (val) => {
    if (clipStart && (val < clipStart || val > maxTime)) return;
    resetTime(val);
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
