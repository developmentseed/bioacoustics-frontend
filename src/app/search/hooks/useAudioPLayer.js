import { useEffect, useState, useRef } from 'react';

export default function useAudioPlayer(audioUrl) {
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ duration, setDuration ] = useState();
  const [ currentTime, setCurrentTime ] = useState(0);
  const [ audioElement, setAudioElement ] = useState();
  const intervalRef = useRef();

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
  
  const handlePlayButtonClick = () => {
    if (isPlaying) {
      audioElement.pause();
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setCurrentTime(audioElement.currentTime);
      }, 25);
      audioElement.play();
    }
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
