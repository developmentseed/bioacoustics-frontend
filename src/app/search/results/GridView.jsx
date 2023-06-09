import T from 'prop-types';
import { Box, Button, Card, CardBody, Grid, GridItem, IconButton, Image, Link, keyframes} from '@chakra-ui/react';
import { MdOpenInNew } from 'react-icons/md';

import { TMatch } from '@/types';
import { formatDate } from '@/utils';
import { getAudioUrlfromImageUrl, sitenameDisplay } from './utils';
import AudioPlayer from './AudioPlayer';
import useAudioPlayer from '../hooks/useAudioPLayer';

function ResultCard({ result, large }) {
  const { entity: { filename, file_timestamp, image_url, clip_offset_in_file }} = result;
  const gridConfig = `min-content ${large ? 'min-content' : ''} 1fr`;
  const audioUrl = getAudioUrlfromImageUrl(image_url);
  const { isPlaying } = useAudioPlayer(audioUrl);
  const slide = keyframes`
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
`;

  return (
    <Card size="sm" fontSize="xs" data-testid="result-card">
      <CardBody as={Grid} gap={2} templateRows={gridConfig} p={0} pb={1}>
        <Box position="absolute" right={1} top={1} zIndex={10}>
          <AudioPlayer audioSrc={audioUrl} />
        </Box>
        <Box 
          position="relative"
          _after={{
            content: '" "',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '0%',
            height: '100%',
            zIndex: 2,
            boxShadow: 'inset 0 0 0 120px rgba(0,0,0,0.5)',
            animation: isPlaying && `${slide} 5s linear 1 forwards`,
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
            <Button as={Link} variant="link" href={audioUrl} target="_blank" rightIcon={<MdOpenInNew />} size="xs">Full Recording</Button>
          ): (
            <IconButton as={Link} variant="link" href={audioUrl} target="_blank" icon={<MdOpenInNew />} size="xs" title="Full Recording" display="inline" />
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
    <Grid templateColumns={`repeat(${gridNumber}, 1fr)`} gap={5} data-testid="results-grid">
      {results.map((result) => <ResultCard key={result.entity.file_seq_id} result={result} large={large} />)}
    </Grid>
  );
}


GridView.propTypes = {
  results: T.arrayOf(TMatch),
  large: T.bool
};
