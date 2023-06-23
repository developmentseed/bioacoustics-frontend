import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { formatTime } from '@/utils';

export default function useClipper(duration, spectrogramCenter, zoom, spectrogramRef, hasDragged, setClip) {
  const [ isClipping, setIsClipping ] = useState(false);
  const clipLength = 5; // in seconds
  const clipCenterRef = useRef();
  const [ clipCenter, setClipCenter ] = useState();
  const [ clipCenterPx, setClipCenterPx ] = useState();
  const clipHandleWidth = 10;
  const hasClipDragged = useRef();

  const setCenter = useCallback((val) => {
    clipCenterRef.current = val;
    setClipCenter(val);
  }, [clipCenterRef]);

  const clipWidthPx = useMemo(
    () => {
      if (!spectrogramRef.current) return;
      return spectrogramRef.current.clientWidth / duration * zoom * clipLength;
    },
    [duration, spectrogramRef, zoom]
  );

  useEffect(() => {
    if (!spectrogramRef.current) return;

    if (!clipCenter) {
      setClipCenterPx();
      return;
    }

    const width = spectrogramRef.current.clientWidth;
    const spectrogramSize = width * zoom;

    const windowSizeRelative = 1 / zoom;
    const windowLeftRelative = spectrogramCenter - windowSizeRelative / 2;
    const clipCenterRelative = clipCenter / duration;

    const windowLeftPx = windowLeftRelative * spectrogramSize;
    const clipCenterPx = clipCenterRelative * spectrogramSize;

    setClipCenterPx(Math.floor(clipCenterPx - windowLeftPx));
  }, [clipCenter, duration, spectrogramCenter, spectrogramRef, zoom]);

  // Reset the current clip windown when a new file is
  // selected, using the audio duration as a proxy
  useEffect(() => setCenter(), [duration, setCenter]);

  const handleClipButtonClick = () => {
    setIsClipping(true);
  };

  const handleCancelButtonClick = () => {
    setIsClipping(false);
    setCenter();
  };

  const handleSubmitButtonClick = () => {
    setIsClipping(false);
    if (clipCenter) {
      setClip(clipCenter - clipLength / 2, clipLength);
    }
  };

  const handleClipSet = useCallback((e) => {
    if (!isClipping || hasDragged.current || hasClipDragged.current) return;

    const width = spectrogramRef.current.clientWidth;
    const spectrogramSize = width * zoom;
    
    const windowSizeRelative = 1 / zoom;
    const windowLeftRelative = spectrogramCenter - windowSizeRelative / 2;
    const windowLeftPx = windowLeftRelative * spectrogramSize;
    
    const { left } = e.currentTarget.getBoundingClientRect();
    const clickPositionPx = e.clientX - left + windowLeftPx;
    const clickPositionRelative = clickPositionPx / spectrogramSize;
    const clickPositionTime = clickPositionRelative * duration;
    setCenter(clickPositionTime);
  }, [duration, hasDragged, isClipping, setCenter, spectrogramCenter, spectrogramRef, zoom]);

  const handleMouseMove = useCallback((e) => {
    hasClipDragged.current = true;
    const width = spectrogramRef.current.clientWidth;
    const spectrogramSize = width * zoom;
    
    const windowSizeRelative = 1 / zoom;
    const windowLeftRelative = spectrogramCenter - windowSizeRelative / 2;
    const windowLeftPx = windowLeftRelative * spectrogramSize;
    
    const { left } = spectrogramRef.current.getBoundingClientRect();
    const dragPositionPx = e.clientX - left + windowLeftPx;
    const dragPositionRelative = dragPositionPx / spectrogramSize;
    const dragPositionTime = dragPositionRelative * duration;

    const pixelPerSecond = spectrogramSize / duration;
    const handleOffset = (clipHandleWidth / 2) / pixelPerSecond;

    const clipCenterTime = dragPositionTime > clipCenterRef.current
      ? dragPositionTime - (clipLength / 2 + handleOffset)
      : dragPositionTime + (clipLength / 2 + handleOffset);

    if ((clipCenterTime + clipLength / 2 < duration) && (clipCenterTime - clipLength / 2 > 0)) {
      setCenter(clipCenterTime);
    }

  }, [clipCenterRef, duration, setCenter, spectrogramCenter, spectrogramRef, zoom]);

  
  const handleDragMouseUp = useCallback((e) => {
    e.stopPropagation();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleDragMouseUp);
    setTimeout(() => hasClipDragged.current = false, 50);
  }, [handleMouseMove]);
  
  const handleDragMouseDown = useCallback((e) => {
    e.stopPropagation();
    if (isClipping) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragMouseUp);
    }
  }, [isClipping, handleMouseMove, handleDragMouseUp]);

  const handleDragClick = (e) => {
    e.stopPropagation();
  };

  return {
    isClipping,
    clipCenterPx,
    clipWidthPx,
    clipHandleWidth,
    handleClipSet,
    clipButtonProps: {
      onClick: handleClipButtonClick,
      isDisabled: duration <= 4 || isClipping
    },
    cancelButtonProps: {
      onClick: handleCancelButtonClick
    },
    submitButtonProps: {
      onClick: handleSubmitButtonClick,
      isDisabled: !clipCenter
    },
    dragButtonProps: {
      onMouseDown: handleDragMouseDown,
      onClick: handleDragClick,
      cursor: isClipping ? 'col-resize' : 'default'
    },
    inInputProps: {
      readOnly: true,
      value: clipCenter ? formatTime(clipCenter - clipLength / 2) : ''
    },
    outInputProps: {
      readOnly: true,
      value: clipCenter ? formatTime(clipCenter + clipLength / 2) : ''
    }
  };
}
