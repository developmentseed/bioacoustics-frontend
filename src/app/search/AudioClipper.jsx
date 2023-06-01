import { useId } from 'react';
import {
  Box,
  ButtonGroup,
  HStack,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
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
    isPlaying,
    currentTime,
    duration,
    playButtonProps,
    scrubberProps
  } = useAudioPlayer(file);

  const {
    zoomInButtonProps,
    zoomOutButtonProps,
    resetZoomButtonProps,
    spectrogramProps,
    playPositionProps,
  } = useSpectrogram(file, waveformId, spectrogramId, currentTime, duration);

  return (
    <>
      <Text>{file.name}</Text>
      <Box position="relative" height="256px">
        <Box position="absolute" top="-4px" border="1px solid white" borderRadius="5px" width="5px" height="264px" bgColor="red" zIndex={5} {...playPositionProps} />
        <Box position="absolute" top="0" left="0" id={spectrogramId} width="100%" {...spectrogramProps} />
        <Box position="absolute" top="0" left="0" id={waveformId} width="100%" height="0" visibility="hidden" />
      </Box>
      <HStack mt="2" gap="5">
        <HStack gap="2" flex="1">
          <IconButton
            type="button"
            variant="ghost"
            borderRadius="full"
            icon={isPlaying ? <MdPauseCircleOutline fontSize="1.75rem" /> : <MdPlayCircleOutline fontSize="1.75rem" />}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
            {...playButtonProps}
          />
          <TimeBox time={currentTime} />
          <Slider min={0} max={duration} step={0.1} minW="300px" flex="1" {...scrubberProps}>
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
