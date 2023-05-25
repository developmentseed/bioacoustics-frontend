import { useId } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  // SliderMark,
  Text,
} from '@chakra-ui/react';

import { TFile } from '@/types';
import { TimeBox } from '@/components';
import { MdAdd, MdRemove, MdFullscreen, MdPlayCircleOutline, MdPauseCircleOutline} from 'react-icons/md';

import useSpectrogram from './hooks/useSpectrogram';
import useAudioPlayer from './hooks/useAudioPLayer';


export default function AudioClipper({ file }) {
  const waveformId = useId();
  const spectrogramId = useId();

  const {
    zoomInButtonProps,
    zoomOutButtonProps,
    resetZoomButtonProps,
    spectrogramProps
  } = useSpectrogram(file, waveformId, spectrogramId);

  const {
    isPlaying,
    currentTime,
    duration,
    playButtonProps,
    scrubberProps
  } = useAudioPlayer(file);

  return (
    <>
      <Text>{file.name}</Text>
      <Box id={waveformId} width="100%" height="0" />
      <Box id={spectrogramId} {...spectrogramProps} />
      <HStack mt="2" gap="5">
        <HStack gap="2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={isPlaying ? <MdPauseCircleOutline /> : <MdPlayCircleOutline />}
            px="0"
            _hover={{
              background: 'white',
              color: 'primary.500',
            }}
            {...playButtonProps}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <TimeBox time={currentTime} />
          <Slider min={0} max={duration} step={0.1} width="300px" {...scrubberProps}>
            <SliderTrack bg="neutral.100">
              <SliderFilledTrack bg="primary.400" />
            </SliderTrack>
            <SliderThumb color="white" border="2px solid" borderColor="primary.400" borderRadius="5px" width="2" height="5" />
          </Slider>
          <TimeBox time={duration} />
        </HStack>

        <HStack>
          <Text color="primary.400" fontSize="sm">Zoom</Text>
          <ButtonGroup isAttached variant="outline">
            <IconButton icon={<MdAdd />} type="button" size="xs" {...zoomInButtonProps} aria-label="Zoom in" />
            <IconButton icon={<MdRemove />} type="button" size="xs" {...zoomOutButtonProps} aria-label="Zoom out" />
          </ButtonGroup>
          <IconButton icon={<MdFullscreen />} type="button" variant="outline" size="xs" {...resetZoomButtonProps} aria-label="Reset zoom" />
        </HStack>
      </HStack>
    </>
  );
}

AudioClipper.propTypes = {
  file: TFile
};
