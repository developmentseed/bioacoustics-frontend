import { useEffect, useRef, useCallback, useState } from 'react';
import { pause } from '@/utils';
import useAudio from './useAudio';

export default function Spectrogram({ file, width=600, height=300 }) {
  const SAMPLE_RATE = 500;
  const canvas = useRef();
  const data = useRef([]);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const { audioAnalyzer, audioContext, audioSource, duration } = useAudio(file, { playSound: false });

  const renderSpectrogram = useCallback((audioFrames) => {
    const context = canvas.current.getContext('2d');
    const barHeight = height / audioFrames[0].length;
    const barWidth = width / audioFrames.length;

    for (let i = 0; i < audioFrames.length; i++) {
      const frameData = audioFrames[i];
      for (let j = 0; j < frameData.length; j++) {
          const intensity = 255 - frameData[j];
          context.fillStyle = `rgb(${intensity},${intensity},${intensity})`;
          context.fillRect(i * barWidth, j * barHeight, barWidth, barHeight);
      }
    }
  }, [height, width]);

  const getNextSample = useCallback(async () => {
    const freqData = new Uint8Array(audioAnalyzer.frequencyBinCount);
    audioAnalyzer.getByteFrequencyData(freqData);
    data.current.push(freqData);

    if (audioContext.currentTime < duration) {
      await pause(1 / SAMPLE_RATE);
      getNextSample();
    } else {
      setIsLoaded(true);
      renderSpectrogram(data.current);
    }

  }, [audioAnalyzer, audioContext, duration, renderSpectrogram]);

  useEffect(() => {
    if (!audioAnalyzer) return;
    audioSource.start();
    getNextSample();
  }, [audioAnalyzer, audioSource, getNextSample]);

  return (
    <div>
      {!isLoaded && <p>Loading...</p>}
      <canvas ref={canvas} width={width} height={height} />
    </div>
  );
}
