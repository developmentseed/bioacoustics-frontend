import T from 'prop-types';
import { IconButton, } from '@chakra-ui/react';
import { MdPlayArrow, MdPause } from 'react-icons/md';
import useAudioPlayer from '../hooks/useAudioPLayer';

export default function AudioPlayer({ audioSrc }) {
  const { isPlaying, playButtonProps } = useAudioPlayer(audioSrc);
  const buttonLabel = isPlaying ? 'Pause' : 'Play';
  const buttonIcon = isPlaying ? <MdPause /> : <MdPlayArrow />;


  return (
    <IconButton
      type="button"
      variant="primary"
      borderRadius="full"
      size="xs"
      icon={buttonIcon}
      aria-label={buttonLabel}
      title={buttonLabel}
      {...playButtonProps}
    />
  );
}

AudioPlayer.propTypes = {
  audioSrc: T.string.isRequired,
};
