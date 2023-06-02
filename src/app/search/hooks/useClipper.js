import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useClipper(duration, spectrogramCenter, zoom, spectrogramRef, hasDragged, setClip) {
  const [ isClipping, setIsClipping ] = useState(false);
  const clipLength = 1; // in seconds
  const [ clipCenter, setClipCenter ] = useState();
  const [ clipCenterPx, setClipCenterPx ] = useState();

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
    setClipCenter();
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
    setClipCenter(clickPositionTime);
  }, [duration, hasDragged, isClipping, spectrogramCenter, spectrogramRef, zoom]);

  return {
    isClipping,
    clipCenterPx,
    clipWidthPx,
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
    }
  };
}
