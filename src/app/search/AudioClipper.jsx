import { useId, useMemo } from 'react';
import T from 'prop-types';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  HStack,
  IconButton,
  Input,
  InputLeftAddon,
  InputGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Center,
} from '@chakra-ui/react';

import { TFile } from '@/types';
import { TimeBox, Error } from '@/components';
import {
  MdAdd,
  MdRemove,
  MdFullscreen,
  MdPlayCircleOutline,
  MdPauseCircleOutline,
  MdContentCut,
  MdDragIndicator,
} from 'react-icons/md';

import useSpectrogram from './hooks/useSpectrogram';
import useAudioPlayer from './hooks/useAudioPLayer';
import useClipper from './hooks/useClipper';
import useFileValidation from './hooks/useFileValidation';
import { FrequencyLegend } from './components';

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
      {children}
    </Button>
  );
}

ToolbarButton.propTypes = {
  children: T.node.isRequired,
  leftIcon: T.node,
};

export default function AudioClipper({ file, setClip, clipStart, clipLength }) {
  const waveformId = useId();
  const spectrogramId = useId();

  const audioUrl = useMemo(() => URL.createObjectURL(file), [file]);
  const { isPlaying, currentTime, duration, playButtonProps, scrubberProps } = useAudioPlayer(audioUrl, clipStart, clipLength);
  const isClipConfirmed = !!clipStart;

  const {
    zoom,
    SPECTROGRAM_HEIGHT,
    spectrogramCenter,
    spectrogramRef,
    hasDragged,
    zoomInButtonProps,
    zoomOutButtonProps,
    resetZoomButtonProps,
    spectrogramProps,
    playPositionProps,
  } = useSpectrogram(file, waveformId, spectrogramId, currentTime, duration);

  const {
    isClipping,
    clipCenterPx,
    clipWidthPx,
    clipHandleWidth,
    handleClipSet,
    clipButtonProps,
    cancelButtonProps,
    submitButtonProps,
    dragButtonProps,
    inInputProps,
    outInputProps,
  } = useClipper(
    duration,
    spectrogramCenter,
    zoom,
    spectrogramRef,
    hasDragged,
    setClip,
    clipStart,
    clipLength
  );

  const { clipLengthError } = useFileValidation(file, duration);

  return (
    <>
      <Text
        p={1}
        border="1px solid"
        bg="green.50"
        borderColor="neutral.100"
        fontSize="xs"
        mb="4"
        overflowX="auto"
        whiteSpace="pre"
      >
        <Text as="span" fontWeight="semibold">
          File:
        </Text>{' '}
        {file.name}
      </Text>
      {(clipLengthError && !isClipConfirmed) && <Error>{clipLengthError}</Error>}
      <Grid templateColumns="50px 1fr">
        <FrequencyLegend width="50px" height={SPECTROGRAM_HEIGHT} />
        <Box
          position="relative"
          height={`${SPECTROGRAM_HEIGHT}px`}
          overflow="hidden"
        >
          <Box
            position="absolute"
            borderRadius="5px"
            width="2px"
            height={`${SPECTROGRAM_HEIGHT}px`}
            bgColor="red"
            zIndex={7}
            boxShadow="0 0 2px 0px rgba(255,255,255,0.5)"
            {...playPositionProps}
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            id={spectrogramId}
            width="100%"
            onClick={handleClipSet}
            {...spectrogramProps}
          >
            {clipCenterPx !== undefined && (
              <>
                {isClipping && (
                  <>
                    <Flex
                      alignItems="center"
                      position="absolute"
                      top="0"
                      left={`${
                        clipCenterPx - clipWidthPx / 2 - clipHandleWidth
                      }px`}
                      width={`${clipHandleWidth}px`}
                      height={`${SPECTROGRAM_HEIGHT}px`}
                      bgColor="#A4FF31"
                      zIndex={7}
                      borderRadius="4px 0 0 4px"
                      {...dragButtonProps}
                    >
                      <MdDragIndicator />
                    </Flex>
                    <Flex
                      alignItems="center"
                      position="absolute"
                      top="0"
                      left={`${clipCenterPx + clipWidthPx / 2}px`}
                      width={`${clipHandleWidth}px`}
                      height={`${SPECTROGRAM_HEIGHT}px`}
                      bgColor="#A4FF31"
                      zIndex={7}
                      borderRadius="0 4px 4px 0"
                      {...dragButtonProps}
                    >
                      <MdDragIndicator />
                    </Flex>
                  </>
                )}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height={`${SPECTROGRAM_HEIGHT}px`}
                  overflow="hidden"
                  display="inline-block"
                  zIndex={5}
                  _before={{
                    content: '""',
                    display: 'block',
                    width: `${clipWidthPx}px`,
                    height: `${SPECTROGRAM_HEIGHT}px`,
                    position: 'absolute',
                    top: '50%',
                    left: clipCenterPx,
                    zIndex: 6,
                    border: '99999px solid rgba(0, 0, 0, 0.6)',
                    transform: 'translate(-50%, -50%)',
                  }}
                  _after={{
                    content: '""',
                    display: 'block',
                    width: `${clipWidthPx}px`,
                    height: `calc(${SPECTROGRAM_HEIGHT}px - 6px)`,
                    position: 'absolute',
                    top: '50%',
                    left: clipCenterPx,
                    zIndex: 6,
                    border: '3px solid #A4FF31',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </>
            )}
          </Box>
          <Box
            position="absolute"
            top="0"
            left="0"
            id={waveformId}
            width="100%"
            height="0"
            visibility="hidden"
          />
        </Box>
      </Grid>
      <Box
        left="0"
        ml="50px"
        id="timeline"
        width="100%"
      />
      <Text fontSize="xs" m="1" ml="50px" textAlign="center">Time (Seconds)</Text>
      {isClipping && (
        <Center>
          <HStack mt="2" gap="2" align="center">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              {...cancelButtonProps}
            >
              Cancel
            </Button>
            <InputGroup size="xs" w="20">
              <InputLeftAddon>In</InputLeftAddon>
              <Input type="text" {...inInputProps} />
            </InputGroup>
            <InputGroup size="xs" w="24">
              <InputLeftAddon>Out</InputLeftAddon>
              <Input type="text" {...outInputProps} />
            </InputGroup>
            <Button
              type="button"
              variant="primary"
              size="xs"
              {...submitButtonProps}
            >
              Confirm
            </Button>
          </HStack>
        </Center>
      )}
      <Flex flexDirection={['column', null, 'row']} mt="2" gap={[1, null, 4]} alignItems="center" flexWrap="wrap">
        <HStack gap={[0, 2]} flex="1">
          <IconButton
            type="button"
            variant="ghost"
            borderRadius="full"
            size={['sm', 'md']}
            px="0 !important"
            icon={
              isPlaying ? (
                <MdPauseCircleOutline fontSize="1.75rem" />
              ) : (
                <MdPlayCircleOutline fontSize="1.75rem" />
              )
            }
            aria-label={isPlaying ? 'Pause' : 'Play'}
            title={isPlaying ? 'Pause' : 'Play'}
            {...playButtonProps}
          />
          <TimeBox time={currentTime} />
          <Slider
            min={0}
            max={duration}
            step={0.1}
            minW={['190px', null, '300px']}
            flex="1"
            {...scrubberProps}
          >
            <SliderTrack bg="neutral.100">
              <SliderFilledTrack bg="primary.400" />
            </SliderTrack>
            <SliderThumb
              color="white"
              border="2px solid"
              borderColor="primary.400"
              borderRadius="5px"
              width="2"
              height="5"
            />
          </Slider>
          <TimeBox time={duration} />
        </HStack>

        <ToolbarButton order={[-1, null, 'initial']} leftIcon={<MdContentCut />} {...clipButtonProps} size="sm">
          Clip
        </ToolbarButton>

        <HStack order={[2, null, 'initial']}>
          <Text color="primary.400" fontSize="sm">
            Zoom
          </Text>
          <ButtonGroup isAttached variant="outline">
            <IconButton
              icon={<MdAdd />}
              type="button"
              size="xs"
              {...zoomInButtonProps}
              aria-label="Zoom in"
            />
            <IconButton
              icon={<MdRemove />}
              type="button"
              size="xs"
              {...zoomOutButtonProps}
              aria-label="Zoom out"
            />
          </ButtonGroup>
          <IconButton
            icon={<MdFullscreen />}
            type="button"
            variant="outline"
            size="xs"
            {...resetZoomButtonProps}
            aria-label="Reset zoom"
          />
        </HStack>
      </Flex>
    </>
  );
}

AudioClipper.propTypes = {
  file: TFile,
  setClip: T.func.isRequired,
  clipStart: T.number,
  clipLength: T.number
};
