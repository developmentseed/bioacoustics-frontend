import { useState } from 'react';
import Spectrogram from './spectrogram';
import Player from './player';
import { TFile } from '@/types';

export default function SpectrogramPlayer({ file, clippable }) {
  const [ currentTime, setCurrentTime ] = useState();
  const [ isClipping, setIsClipping ] = useState(false);
  const [ clipWindow, setClipWindow ] = useState([]);

  const handleClipActivate = () => setIsClipping(true);
  const handleClipCancel = () => {
    setIsClipping(false);
    setClipWindow(clipWindow.map(x => x)); // force reset on canvas
  };

  const handleClipSelect = (window) => {
    if (window[0] < window[1]) {
      setClipWindow([window[0], window[1]]);
    } else {
      setClipWindow([window[1], window[0]]);
    }
    setIsClipping(false);
  };

  const uploadClip = async () => {
    const reader = new FileReader();
    reader.onload = async () => {
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(reader.result);
      const [startTime, endTime] = clipWindow;
      const cutBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        Math.floor((endTime - startTime) * audioBuffer.sampleRate),
        audioBuffer.sampleRate
      );
      const startAt = Math.floor((startTime * audioBuffer.sampleRate));
      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        const channelData = audioBuffer.getChannelData(i);
        const cutChannelData = cutBuffer.getChannelData(i);

        for (let j = 0; j < cutBuffer.length; j++) {
          cutChannelData[j] = channelData[startAt + j];
        }
      }

      // TODO: Upload buffer
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{display: 'grid'}}>
      <Spectrogram
        file={file}
        currentTime={currentTime}
        isClipping={isClipping}
        selectedClip={clipWindow}
        handleClipSelect={handleClipSelect}
      />
      <Player file={file} setCurrentTime={setCurrentTime} />
      {clippable && (
        <div>
          {!isClipping ? (
            <>
              <button type="button" onClick={handleClipActivate}>Clip</button>
              {clipWindow.length > 0 && (
                <>
                  <button type="button" onClick={uploadClip}>Upload</button>
                </>
              )}
            </>
          ) : (
            <>
              <p>Click on the spectrogram to select clip</p>
              <button type="button" onClick={handleClipCancel}>Cancel</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

SpectrogramPlayer.propTypes = {
  file: TFile.isRequired
};
