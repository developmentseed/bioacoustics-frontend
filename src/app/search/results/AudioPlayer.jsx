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
      color={isPlaying ? 'white' : 'primary.400'}
      background={isPlaying ? 'primary.400' : 'white'}
      borderRadius="full"
      size="xs"
      border="2px solid"
      borderColor="primary.400"
      fontSize="1.125rem"
      icon={buttonIcon}
      aria-label={buttonLabel}
      title={buttonLabel}
      _hover={{
        background: 'primary.400',
        color: 'white'
      }}
      {...playButtonProps}
    />
  );
}

AudioPlayer.propTypes = {
  audioSrc: T.string.isRequired,
};
