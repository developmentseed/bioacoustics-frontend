import Spectrogram from './spectrogram';
import Player from './player';
import { useState } from 'react';

export default function SpectrogramPlayer({ file }) {
  const [ currentTime, setCurrentTime ] = useState();

  return (
    <div style={{display: 'grid'}}>
      <Spectrogram file={file} currentTime={currentTime} />
      <Player file={file} setCurrentTime={setCurrentTime} />
    </div>
  );
}
