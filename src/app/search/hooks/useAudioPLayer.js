import { useMemo, useState } from 'react';

export default function useAudioPlayer(file) {
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ duration, setDuration ] = useState();
  const [ currentTime, setCurrentTime ] = useState(0);

  const audioElement = useMemo(() => {
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
    return el;
  }, [file]);
  
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
