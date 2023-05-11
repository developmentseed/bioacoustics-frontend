import { useEffect, useRef, useCallback, useState} from 'react';
import useAudio from './useAudio';

export default function Spectrogram({ file, currentTime, width=600, height=300 }) {
  const canvas = useRef();
  const playbackRate = 2;
  const { audioAnalyzer, audioContext, audioSource, duration } = useAudio(file, { playSound: false, playbackRate });

  const [ timebarPosition, setTimebarPosition ] = useState();

  const getNextSample = useCallback(async () => {
    const context = canvas.current.getContext('2d');

    const frameData = new Uint8Array(audioAnalyzer.frequencyBinCount);
    audioAnalyzer.getByteFrequencyData(frameData);

    const barHeight = height / frameData.length;
    const barWidth = 15;
    const x = width / duration * audioContext.currentTime * playbackRate;

    for (let i = 0; i < frameData.length; i++) {
      const intensity = 255 - frameData[i];
      context.fillStyle = `rgb(${intensity},${intensity},${intensity})`;
      context.fillRect(x, i * barHeight, barWidth, barHeight);
    }

    if (audioContext.currentTime < duration / playbackRate) {
      setTimeout(getNextSample, 1);
    }
  }, [audioAnalyzer, audioContext, duration, height, width]);

  useEffect(() => {
    if (!audioAnalyzer) return;
    audioSource.start();
    getNextSample();
  }, [audioAnalyzer, audioSource, getNextSample]);

  useEffect(() => {
    if (!(duration && currentTime)) return;

    const x = Math.floor(width / duration * currentTime);
    setTimebarPosition(x > width ? width : x);
  }, [currentTime, duration, height, width]);

  return (
    <div style={{ position: 'relative', height }}>
      <canvas ref={canvas} width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }} />
      {currentTime && <div style={{ width: '1px', height: height, backgroundColor: 'red', position: 'absolute', top: 0, left: timebarPosition }} />}
    </div>
  );
}
