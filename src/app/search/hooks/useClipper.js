import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

export default function useClipper(duration, spectrogramCenter, zoom, spectrogramRef, hasDragged, setClip) {
  const [ isClipping, setIsClipping ] = useState(false);
  const clipLength = 1; // in seconds
  const clipCenterRef = useRef();
  const [ clipCenter, setClipCenter ] = useState();
  const [ clipCenterPx, setClipCenterPx ] = useState();
  const clipHandleWidth = 15;

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
    if (!isClipping || hasDragged.current) return;

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

    setCenter(clipCenterTime);
  }, [clipCenterRef, duration, setCenter, spectrogramCenter, spectrogramRef, zoom]);

  
  const handleDragMouseUp = useCallback((e) => {
    e.stopPropagation();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleDragMouseUp);
  }, [handleMouseMove]);
  
  const handleDragMouseDown = useCallback((e) => {
    e.stopPropagation();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragMouseUp);
  }, [handleMouseMove, handleDragMouseUp]);

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
      isDisabled: isClipping
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
      onClick: handleDragClick
    }
  };
}
