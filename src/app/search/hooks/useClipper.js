import { useEffect, useMemo, useState } from 'react';

const MAX_CLIP_LENGTH = 1; // in seconds

export default function useClipper(duration, spectrogramCenter, zoom, spectrogramRef) {
  const [ isClipping, setIsClipping ] = useState(false);
  const [ clipStart, setClipStart ] = useState(1);
  const [ clipLength, setClipLength ] = useState();
  const [ clipCenterPx, setClipCenterPx ] = useState();

  // useEffect(() => {
  //   if (duration) {
  //     setClipLength(Math.min(duration, MAX_CLIP_LENGTH));
  //   }
  // }, [duration]);

  // const clipWidthPx = useMemo(() => pixelPerSecond * clipLength, [clipLength, pixelPerSecond]);

  // useEffect(() => {
  //   // console.log(spectrogramCenter)
  //   const centerPosPx = pixelPerSecond * duration * spectrogramCenter;
  //   // console.log(centerPosPx)
  //   const windowXPixel = centerPosPx - windowWidth / 2;
  //   // console.log(windowXPixel)
  //   const windowXTime = (spectrogramCenter * duration) - ((windowWidth / 2) / pixelPerSecond);
  //   // console.log(windowXTime)
  //   const clipCenter = (clipStart + (clipLength / 2) - windowXTime) * pixelPerSecond + windowXPixel;
  //   console.log(spectrogramCenter, clipCenter);
  //   setClipCenterPx(Math.floor(clipCenter));
  // }, [clipLength, clipStart, duration, pixelPerSecond, spectrogramCenter]);

  const handleClipButtonClick = () => {
    setIsClipping(true);
  };

  const handleCancelButtonClick = () => {
    setIsClipping(false);
  };

  return {
    isClipping,
    // clipCenterPx,
    // clipWidthPx,
    clipButtonProps: {
      onClick: handleClipButtonClick,
      isDisabled: isClipping
    },
    cancelButtonProps: {
      onClick: handleCancelButtonClick
    },
    submitButtonProps: {

    }
  };
}
