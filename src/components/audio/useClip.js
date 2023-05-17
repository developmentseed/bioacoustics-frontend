import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { timeToX, xToTime } from './utils';

export default function useClip(clipperEl, selectedClip, handleClipSelect, width, duration) {
  const [ isSelecting, setIsSelecting ] = useState(false);
  const [ pixelClipWindow, setPixelClipWindow ] = useState([]);

  // handleClipMove does not have access to the up-to-date state, copying the state to a ref
  const tempClipCoordinates = useRef([]);
  useEffect(() => {tempClipCoordinates.current = pixelClipWindow;}, [pixelClipWindow]);

  /**
   * Returns the mouse position relative to the #clipper element
   */
  const getMousePosition = (e) => {
    const target = e.target.closest('#clipper');
    const { left } = target.getBoundingClientRect();
    return e.clientX - left;
  };

  /*
   * Handles mousemove events over the clipperElement. Calculates the new pixelClipWindow
   * coordinates relative to the previous position.
   */
  const handleClipMove = useCallback((e) => {
    if (!tempClipCoordinates.current.length) return;

    const x = getMousePosition(e);
    setPixelClipWindow([tempClipCoordinates.current[0], x]);
  }, []);

  /*
   * Handles click events on the clipperElement.
   */
  const handleClipClick = (e) => {
    const x = getMousePosition(e);

    if (isSelecting) {
      const clipWindow = [pixelClipWindow[0], x];
      setIsSelecting(false);
      setPixelClipWindow(clipWindow);
      handleClipSelect(clipWindow.map(i => xToTime(i, width, duration)));
      clipperEl.current.removeEventListener('mousemove', handleClipMove);
    } else {
      setIsSelecting(true);
      setPixelClipWindow([x]);
      clipperEl.current.addEventListener('mousemove', handleClipMove);
    }
  };

  useEffect(
    () => {
      // Reset the current state, this will only be run when `selectedClip` changes
      setIsSelecting(false);
      setPixelClipWindow(selectedClip.map(t => timeToX(t, width, duration)));
      if (clipperEl.current) {
        clipperEl.current.removeEventListener('mousemove', handleClipMove);
      }
    },
    [clipperEl, duration, handleClipMove, selectedClip, width]
  );

  const displayCoordinates = useMemo(() => {
    if (pixelClipWindow.length < 2) {
      return pixelClipWindow;
    }

    if (pixelClipWindow[0] < pixelClipWindow[1]) {
      return pixelClipWindow;
    } else {
      return [pixelClipWindow[1], pixelClipWindow[0]];
    }
  }, [pixelClipWindow]);

  return {
    pixelClipWindow: displayCoordinates,
    handleClipClick
  };
}
