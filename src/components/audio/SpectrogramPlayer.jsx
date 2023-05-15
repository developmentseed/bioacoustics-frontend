import Spectrogram from './spectrogram';
import Player from './player';
import { useState } from 'react';

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
            <button type="button" onClick={handleClipActivate}>Clip</button>
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
