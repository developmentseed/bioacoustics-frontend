import { useState } from 'react';
import Spectrogram from './spectrogram';
import Player from './player';
import { TFile } from '@/types';

export default function SpectrogramPlayer({ file }) {
  const [ currentTime, setCurrentTime ] = useState();

  return (
    <div style={{display: 'grid'}}>
      <Spectrogram file={file} currentTime={currentTime} />
      <Player file={file} setCurrentTime={setCurrentTime} />
    </div>
  );
}

SpectrogramPlayer.propTypes = {
  file: TFile.isRequired
};
