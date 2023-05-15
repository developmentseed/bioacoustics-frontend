import { useState, useCallback, useEffect } from 'react';

const formatTime = (time) => {
  const currentTimeInSeconds = Math.floor(time);
  const minutes = Math.floor(currentTimeInSeconds / 60);
  let seconds = currentTimeInSeconds % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

export default function useTimeUpdate(audioRef, onUpdate) {
  const [ displayTime, setDisplayTime ] = useState('0:00');

  const updateDisplayTime = useCallback(e => {
    const time = e.target.currentTime;
    onUpdate(time);
    setDisplayTime(formatTime(time));
  }, [onUpdate]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.ontimeupdate = updateDisplayTime;

      return () => audioElement.ontimeupdate = null;
    }
  }, [audioRef, updateDisplayTime]);

  return {
    displayTime
  };
}
