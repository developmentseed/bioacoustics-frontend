import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const formatTime = (time) => {
  const currentTimeInSeconds = Math.floor(time);
  const minutes = Math.floor(currentTimeInSeconds / 60);
  let seconds = currentTimeInSeconds % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
};

export default function Player({ file, setCurrentTime = () => {} }) {
  const audioRef = useRef();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ displayTime, setDisplayTime ] = useState('0:00');

  const buttonLabel = isPlaying ? 'Pause' : 'Play';
  const audioUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const updateDisplayTime = useCallback(e => {
    const time = e.target.currentTime;
    setCurrentTime(time);
    setDisplayTime(formatTime(time));
  }, [setCurrentTime]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime();
  }, [setCurrentTime]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [audioRef, isPlaying, updateDisplayTime]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.ontimeupdate = updateDisplayTime;

      return () => audioElement.ontimeupdate = null;
    }
  }, [audioRef, updateDisplayTime]);

  return (
    <div>
      <span>{displayTime}</span>
      <audio src={audioUrl} ref={audioRef} onEnded={handleEnded} />
      <button type="button" onClick={togglePlay}>{buttonLabel}</button>
    </div>
  );
}
