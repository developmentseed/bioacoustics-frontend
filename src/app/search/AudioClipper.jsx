import { useId } from 'react';
import { Box, ButtonGroup, HStack, IconButton, Text } from '@chakra-ui/react';

import { TFile } from '@/types';
import { MinusIcon, PlusIcon, ResetZoomIcon } from '@/icons';

import useSpectrogram from './hooks/useSpectrogram';


export default function AudioClipper({ file }) {
  const waveformId = useId();
  const spectrogramId = useId();

  const {
    zoomInButtonProps,
    zoomOutButtonProps,
    resetZoomButtonProps,
    spectrogramProps
  } = useSpectrogram(file, waveformId, spectrogramId);

  return (
    <>
      <Text>{file.name}</Text>
      <Box id={waveformId} width="100%" height="0" />
      <Box id={spectrogramId} {...spectrogramProps} />

      <HStack mt="2">
        <HStack>
          <Text color="primary.400" fontSize="sm">Zoom</Text>
          <ButtonGroup isAttached variant="outline">
            <IconButton icon={<PlusIcon />} type="button" size="xs" {...zoomInButtonProps} aria-label="Zoom in" />
            <IconButton icon={<MinusIcon />} type="button" size="xs" {...zoomOutButtonProps} aria-label="Zoom out" />
          </ButtonGroup>
          <IconButton icon={<ResetZoomIcon />} type="button" variant="outline" size="xs" {...resetZoomButtonProps} aria-label="Reset zoom" />
        </HStack>
      </HStack>
    </>
  );
}

AudioClipper.propTypes = {
  file: TFile
};
