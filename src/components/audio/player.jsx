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

export default function Player({ file }) {
  const audioRef = useRef();
  const playAnimationRef = useRef();
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ currentTime, setCurrentTime ] = useState('0:00');

  const buttonLabel = isPlaying ? 'Pause' : 'Play';
  const audioUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const togglePlay = () => setIsPlaying((prev) => !prev);

  const handleEnded = useCallback(() => setIsPlaying(false), []);

  const updateCurrentTime = useCallback(() => {
    const currentTime = audioRef.current.currentTime;
    setCurrentTime(formatTime(currentTime));
    playAnimationRef.current = requestAnimationFrame(updateCurrentTime);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      playAnimationRef.current = requestAnimationFrame(updateCurrentTime);
    } else {
      audioRef.current.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  }, [audioRef, isPlaying, updateCurrentTime]);

  return (
    <>
      <span>{currentTime}</span>
      <audio src={audioUrl} ref={audioRef} onEnded={handleEnded} />
      <button type="button" onClick={togglePlay}>{buttonLabel}</button>
    </>
  );
}
