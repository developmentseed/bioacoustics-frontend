import { useCallback, useMemo, useRef, useState } from 'react';
import useTimeUpdate from './useTimeUpdate';

export default function Player({ file, setCurrentTime = () => {} }) {
  const audioRef = useRef();
  const [ isPlaying, setIsPlaying ] = useState(false);

  const buttonLabel = isPlaying ? 'Pause' : 'Play';
  const audioUrl = useMemo(() => URL.createObjectURL(file), [file]);

  const { displayTime } = useTimeUpdate(audioRef, setCurrentTime);

  const togglePlay = () => {
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying((prev) => !prev);
  };

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime();
  }, [setCurrentTime]);

  return (
    <div>
      <span>{displayTime}</span>
      <audio src={audioUrl} ref={audioRef} onEnded={handleEnded} />
      <button type="button" onClick={togglePlay}>{buttonLabel}</button>
    </div>
  );
}
