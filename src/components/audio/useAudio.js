import { useEffect, useState } from 'react';

const defaultOptions = {
  playSound: true,
  playbackRate: 1,
};

export default function useAudio(file, options) {
  const { playSound, playbackRate } = { ...defaultOptions, ...options };
  const [ audioContext, setAudioContext ] = useState();
  const [ audioAnalyzer, setAudioAnalyzer ] = useState();
  const [ audioSource, setAudioSource ] = useState();
  const [ duration, setDuration ] = useState();

  useEffect(() => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const context = new AudioContext();
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 2048;
      const buffer = await context.decodeAudioData(reader.result);
      const source = context.createBufferSource();
      source.playbackRate.value = playbackRate;
  
      source.buffer = buffer;
      source.connect(analyzer);
      if (playSound) {
        analyzer.connect(context.destination);
      }
  
      setAudioAnalyzer(analyzer);
      setAudioContext(context);
      setAudioSource(source);
      setDuration(buffer.duration);
    };
    reader.readAsArrayBuffer(file);
  }, [file, playSound, playbackRate]);

  return {
    audioAnalyzer,
    audioContext,
    audioSource,
    duration,
  };
}
