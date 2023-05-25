import { useState, useCallback, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram';
import MinimapPlugin from 'wavesurfer.js/src/plugin/minimap';
import colormap from 'colormap';
import CursorPlugin from 'wavesurfer.js/src/plugin/cursor';
import PlayheadPlugin from 'wavesurfer.js/src/plugin/playhead';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';

const MAX_ZOOM = 10;

const colorMap = colormap({
    colormap: 'viridis',
    nshades: 256,
    format: 'float'
});

export default function useSpectrogramNavigation(file, waveformId, spectrogramId) {
  const wavesurferRef = useRef();
  const spectrogramRef = useRef();
  const spectrogramCenter = useRef(0.5);
  const [ zoom, setZoom ] = useState(1);
  const [ spectrogramCursor, setSpectrogramCursor ] = useState('grab');

  // Initialises the spectrogram with the audio data
  useEffect(() => {
    var wavesurfer = WaveSurfer.create({
      container: `#${CSS.escape(waveformId)}`,
      scrollParent: true,
      autoCenter: true,
      plugins: [
        SpectrogramPlugin.create({
            wavesurfer: wavesurfer,
            container: `#${CSS.escape(spectrogramId)}`,
            labels: true,
            height: 256,
            colorMap: colorMap,
        }),
        MinimapPlugin.create({
          container: '#minimap',
          waveColor: '#777',
          progressColor: '#222',
          height: 20
        }),
        CursorPlugin.create({
          showTime: true,
            opacity: 1,
            customShowTimeStyle: {
                'background-color': '#000',
                color: '#fff',
                padding: '2px',
                'font-size': '10px'
            }
        }),
        PlayheadPlugin.create({
          returnOnPause: false,
          moveOnSeek: true,
          draw: true
        }),
        RegionsPlugin.create({
          
        }),
        TimelinePlugin.create({
          container: '#timeline',
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

  // Rerenders the spectrogram whenever the zoom level has changed
  useEffect(() => {
    if (wavesurferRef.current.isReady) {
      const duration = wavesurferRef.current.getDuration();
      const width = spectrogramRef.current.clientWidth;
      const pixelPerSecond = width / duration;
      wavesurferRef.current.zoom(pixelPerSecond * zoom);
      wavesurferRef.current.seekAndCenter(spectrogramCenter.current || 0.5);
      wavesurferRef.current.spectrogram.init();
    }
  }, [wavesurferRef, zoom]);

  // Event handler for zoom-in click
  const handleZoomIn = () => setZoom(zoom + 1);

  // Event handler for zoom-out click
  const handleZoomOut = () => setZoom(zoom - 1);

  // Event handler mouse-move over the spectrogram
  // Calculates the new center position relative to full length of the audio,
  // i.e. the beginning of the track is 0, the end is 1, half-way is .5
  const handleMouseMove = useCallback((e) => {
    const width = spectrogramRef.current.clientWidth;

    const newPosition = spectrogramCenter.current + (e.movementX * -1 / width);
    const limit = 1 / Math.pow(zoom, 2);
    if (newPosition >= limit && newPosition <= 1 - limit) {
      wavesurferRef.current.seekAndCenter(newPosition);
      spectrogramCenter.current = newPosition;
    }
  }, [wavesurferRef, zoom]);

  // Event handler for mouse-down events over the spectrogram
  // Activates panning by registering the mouse-move handler
  const handleMouseDown = useCallback((e) => {
    e.target.addEventListener('mousemove', handleMouseMove);
    setSpectrogramCursor('ew-resize');
  }, [handleMouseMove]);

  // Event handler for mouse-up events over the spectrogram
  // Deactivates panning by removing the mouse-move handler
  const handleMouseUp = useCallback((e) => {
    e.target.removeEventListener('mousemove', handleMouseMove);
    setSpectrogramCursor('grab');
  }, [handleMouseMove]);

  // Event handler for the zoom-reset click
  const handleResetZoom = useCallback(() => setZoom(1), []);

  return {
    zoom,
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
      onMouseUp: handleMouseUp,
      cursor: spectrogramCursor,
    }
  };
}
