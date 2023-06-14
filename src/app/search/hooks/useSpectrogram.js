import { useState, useCallback, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';

const MAX_ZOOM = 5;

export default function useSpectrogramNavigation(file, waveformId, spectrogramId, currentTime, duration) {
  const SPECTROGRAM_HEIGHT = 144;
  const wavesurferRef = useRef();
  const spectrogramRef = useRef();
  const spectrogramCenterRef = useRef(0.5);
  const [ spectrogramCenter, setSpectrogramCenter ] = useState(0.5);
  const [ zoom, setZoom ] = useState(1);
  const [ spectrogramCursor, setSpectrogramCursor ] = useState('grab');
  const [ playPosition, setPlayPosition ] = useState();
  const [ playPositionDisplay, setPlayPositionDisplay ] = useState('block');
  const hasDragged = useRef(false);

  const setCenter = useCallback((val) => {
    spectrogramCenterRef.current = val;
    setSpectrogramCenter(val);
  }, []);

  // Initialises the spectrogram with the audio data
  useEffect(() => {
    var wavesurfer = WaveSurfer.create({
      container: `#${CSS.escape(waveformId)}`,
      scrollParent: true,
      plugins: [
        SpectrogramPlugin.create({
            wavesurfer: wavesurfer,
            container: `#${CSS.escape(spectrogramId)}`,
            labels: false,
            height: SPECTROGRAM_HEIGHT,
        }),
        TimelinePlugin.create({
          container: '#timeline',
          timeInterval: 0.5,
          primaryLabelInterval: 2,
          secondaryLabelInterval: 10,
        })
      ]
    });

    var reader = new FileReader();
    reader.onload = function (e) {
      const blob = new Blob([new Uint8Array(e.target.result)]);
      wavesurfer.loadBlob(blob);
    };
    reader.readAsArrayBuffer(file);
    wavesurfer.seekAndCenter(0.5);
    wavesurferRef.current = wavesurfer;
  }, [file, waveformId, spectrogramId, wavesurferRef]);

  const updatePlayPosition = useCallback(() => {
    const width = spectrogramRef.current.clientWidth;

    const relativeWindowSize = 1 / zoom; // The relative size of the display window. At zoom level 2 it covers .5 of the whole track.
    const relativeWindowLeft = spectrogramCenterRef.current - relativeWindowSize / 2; // The position of the left edge of the display window, relative to the whole track.
    const relativeTime = currentTime / duration; // The current time of the audio playback, relative to the whole track.

    const spectrogramSize = width * zoom; // The size of the whole spectrogram in pixels, ie. zoom level 2 it's twice as big as the displayed spectrogram.
    const spectrogramWindowLeft = relativeWindowLeft * spectrogramSize; // The position of the left edge of the display window on the whole spectrogram.
    const audioPlaybackPosition = spectrogramSize * relativeTime; // The position of the audio playback on the whole spectrogram
    const displayPosition = audioPlaybackPosition - spectrogramWindowLeft; // The posotion of the audio playback relative to the left border of the spectrogram window.

    setPlayPosition(displayPosition);

    const displayPlayPosition = relativeTime >= relativeWindowLeft && relativeTime <= relativeWindowLeft + relativeWindowSize;
    setPlayPositionDisplay(displayPlayPosition ? 'block' : 'none');
  }, [currentTime, duration, zoom]);

  useEffect(updatePlayPosition, [updatePlayPosition, currentTime, duration, zoom]);

  // Rerenders the spectrogram whenever the zoom level has changed
  useEffect(() => {
    if (wavesurferRef.current.isReady) {
      const duration = wavesurferRef.current.getDuration();
      const width = spectrogramRef.current.clientWidth;
      const pixelPerSecond = width / duration;
      wavesurferRef.current.zoom(pixelPerSecond * zoom);
      wavesurferRef.current.seekAndCenter(spectrogramCenterRef.current || 0.5);
      wavesurferRef.current.spectrogram.init();
    }
  }, [wavesurferRef, zoom]);

  const zoomTo = useCallback((newZoom) => {
    if (newZoom === 1) {
      spectrogramCenterRef.current = 0.5;
    } else {
      const panPadding = 1 / newZoom / 2;
      const minCenter = panPadding;
      const maxCenter = 1 - panPadding;

      if (spectrogramCenterRef.current < maxCenter) {
        spectrogramCenterRef.current = Math.max(spectrogramCenterRef.current, minCenter);
      }
      
      if (spectrogramCenterRef.current > minCenter) {
        spectrogramCenterRef.current = Math.min(spectrogramCenterRef.current, maxCenter);
      }
    }

    setZoom(newZoom);
  }, []);

  // Event handler for zoom-in click
  const handleZoomIn = () => zoomTo(zoom + 1);

  // Event handler for zoom-out click
  const handleZoomOut = () => zoomTo(zoom - 1);

  // Event handler for the zoom-reset click
  const handleResetZoom = useCallback(() => zoomTo(1), [zoomTo]);

  // Event handler mouse-move over the spectrogram
  // Calculates the new center position relative to full length of the audio,
  // i.e. the beginning of the track is 0, the end is 1, half-way is .5
  const handleMouseMove = useCallback((e) => {
    hasDragged.current = true;
    const width = spectrogramRef.current.clientWidth;

    const newPosition = spectrogramCenterRef.current + (e.movementX * -1 / width);
    const limit = 1 / (zoom * 2);
    if (newPosition >= limit && newPosition <= 1 - limit) {
      wavesurferRef.current.seekAndCenter(newPosition);
      setCenter(newPosition);
      updatePlayPosition();
    }
  }, [zoom, setCenter, updatePlayPosition]);

  // Event handler for mouse-up events over the spectrogram
  // Deactivates panning by removing the mouse-move handler
  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setSpectrogramCursor('grab');
    setTimeout(() => hasDragged.current = false, 50);
  }, [handleMouseMove]);

  // Event handler for mouse-down events over the spectrogram
  // Activates panning by registering the mouse-move handler
  const handleMouseDown = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    setSpectrogramCursor('ew-resize');
  }, [handleMouseMove, handleMouseUp]);

  return {
    zoom,
    SPECTROGRAM_HEIGHT,
    spectrogramCenter,
    spectrogramRef,
    hasDragged,
    zoomInButtonProps: {
      onClick: handleZoomIn,
      isDisabled: zoom === MAX_ZOOM
    },
    zoomOutButtonProps: {
      onClick: handleZoomOut,
      isDisabled: zoom === 1
    },
    resetZoomButtonProps: {
      onClick: handleResetZoom,
      isDisabled: zoom === 1
    },
    spectrogramProps: {
      ref: spectrogramRef,
      onMouseDown: handleMouseDown,
      cursor: spectrogramCursor,
    },
    playPositionProps: {
      left: playPosition,
      display: playPositionDisplay
    }
  };
}
