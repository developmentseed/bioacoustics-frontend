import T from 'prop-types';
import { Box, Button, Card, CardBody, Grid, GridItem, IconButton, Image, Link } from '@chakra-ui/react';
import { MdOpenInNew,  MdPlayArrow, MdPause } from 'react-icons/md';

import { TMatch } from '@/types';
import { formatDate } from '@/utils';
import { sitenameDisplay } from './utils';
// import AudioPlayer from './AudioPlayer';
import useAudioPlayer from '../hooks/useAudioPLayer';

function ResultCard({ result, large }) {
  const { entity: { file_seq_id, filename, file_timestamp, image_url, audio_url, clip_offset_in_file }} = result;
  const gridConfig = `min-content ${large ? 'min-content' : ''} 1fr`;
  const fullAudioUrl = `https://data.acousticobservatory.org/listen/${file_seq_id}`;

  const { isPlaying, currentTime, duration, playButtonProps } = useAudioPlayer(audio_url);
  const buttonLabel = isPlaying ? 'Pause' : 'Play';
  const buttonIcon = isPlaying ? <MdPause /> : <MdPlayArrow />;

  return (
    <Card size="sm" fontSize="xs" data-testid="result-card">
      <CardBody as={Grid} gap={2} templateRows={gridConfig} p={0} pb={1}>
        <Box position="absolute" right={1} top={1} zIndex={10}>
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
        </Box>
        <Box 
          position="relative"
          _after={{
            content: '" "',
            position: 'absolute',
            top: 0,
            left: 0,
            width: isPlaying && `${(currentTime / duration) * 100}%`,
            height: '100%',
            zIndex: 2,
            boxShadow: 'inset 0 0 0 120px rgba(0,0,0,0.5)',
          }}
        >
          <Image
            src={image_url}
            alt={`Spectrogram for match from ${filename}`}
            loading="lazy"
            fit="fill"
            htmlHeight="256"
            htmlWidth="215"
            height="100"
            width="100%"
          />
        </Box>
        {large && (
          <Grid templateColumns="min-content 1fr" gap="1" px={2}>
            <GridItem fontWeight="bold" color="neutral.400">Site:</GridItem>
            <GridItem>{ sitenameDisplay(result) }</GridItem>
            <GridItem fontWeight="bold" color="neutral.400">Recorded:</GridItem>
            <GridItem>{ formatDate(file_timestamp) }</GridItem>
            <GridItem fontWeight="bold" color="neutral.400">Result:</GridItem>
            <GridItem>{ formatDate(file_timestamp + clip_offset_in_file) }</GridItem>
          </Grid>
        )}
        <GridItem alignSelf="end" px={2}>
          {large ? (
            <Button as={Link} variant="link" href={fullAudioUrl} target="_blank" rightIcon={<MdOpenInNew />} size="xs">Full Recording</Button>
          ): (
            <IconButton as={Link} variant="link" href={fullAudioUrl} target="_blank" icon={<MdOpenInNew />} size="xs" title="Full Recording" display="inline" />
          )}
        </GridItem>
      </CardBody>
    </Card>
  );
}

ResultCard.propTypes = {
  result: TMatch.isRequired,
  large: T.bool
};

export default function GridView({ results, large }) {
  const gridNumber = large ? 4 : 6;

  return (
    <Grid templateColumns={`repeat(${gridNumber}, 1fr)`} gap={large ? 4 : 2} data-testid="results-grid">
      {results.map((result) => <ResultCard key={result.entity.file_seq_id} result={result} large={large} />)}
    </Grid>
  );
}


GridView.propTypes = {
  results: T.arrayOf(TMatch),
  large: T.bool
};
