import { useId } from 'react';
import T from 'prop-types';
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
  Text,
  Center,
} from '@chakra-ui/react';

import { TFile } from '@/types';
import { TimeBox } from '@/components';
import { MdAdd, MdRemove, MdFullscreen, MdPlayCircleOutline, MdPauseCircleOutline, MdContentCut } from 'react-icons/md';

import useSpectrogram from './hooks/useSpectrogram';
import useAudioPlayer from './hooks/useAudioPLayer';
import useClipper from './hooks/useClipper';


function ToolbarButton({ children, leftIcon, ...props }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      leftIcon={leftIcon}
      px="0"
      _hover={{
        background: 'white',
        color: 'primary.500',
      }}
      {...props}
    >
      { children }
    </Button>
  );
}

ToolbarButton.propTypes = {
  children: T.node.isRequired,
  leftIcon: T.node
};


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
    zoom,
    spectrogramCenter,
    spectrogramRef,
    zoomInButtonProps,
    zoomOutButtonProps,
    resetZoomButtonProps,
    spectrogramProps,
    playPositionProps,
  } = useSpectrogram(file, waveformId, spectrogramId, currentTime, duration);

  const {
    isClipping,
    // clipCenterPx,
    // clipWidthPx,
    clipButtonProps,
    cancelButtonProps,
    submitButtonProps
  } = useClipper(duration, spectrogramCenter, zoom, spectrogramRef);

  return (
    <>
      <Text>{file.name}</Text>
      <Box position="relative" height="256px">
        <Box position="absolute" top="-4px" border="1px solid white" borderRadius="5px" width="5px" height="264px" bgColor="red" zIndex={7} {...playPositionProps} />
        <Box position="absolute" top="0" left="0" id={spectrogramId} width="100%" {...spectrogramProps}>
          {/* <Box
            position="absolute"
            top="0"
            left="0"
            width="100%"
            height="256px"
            overflow="hidden"
            display="inline-block"
            zIndex={5}
            _before={{
              content: '""',
              display: 'block',
              width: `${clipWidthPx}px`, // TODO: Should be dynamic
              height: '256px',
              position: 'absolute',
              top: '50%',
              left: clipCenterPx, // TODO: Should be dynamic
              zIndex: 6,
              border: '1000px solid rgba(0, 0, 0, 0.6)',
              transform: 'translate(-50%, -50%)'
            }}
          /> */}
        </Box>
        <Box position="absolute" top="0" left="0" id={waveformId} width="100%" height="0" visibility="hidden" />
      </Box>
      {isClipping && (
        <Center>
          <HStack mt="2" gap="5" align="center">
            <Button type="button" variant="ghost" size="xs" {...cancelButtonProps}>Cancel</Button>
            <Button type="button" variant="primary" size="xs" {...submitButtonProps}>Clip</Button>
          </HStack>
        </Center>
      )}
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

        <ToolbarButton
          leftIcon={<MdContentCut />}
          {...clipButtonProps}
        >
          Clip
        </ToolbarButton>

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
