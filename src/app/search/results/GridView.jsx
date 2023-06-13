import T from 'prop-types';
import { Button, Card, CardBody, Grid, GridItem, IconButton, Image, Link, Text } from '@chakra-ui/react';
import { MdOpenInNew } from 'react-icons/md';

import { TMatch } from '@/types';
import { formatDate } from '@/utils';
import { sitenameDisplay } from './utils';
import AudioPlayer from './AudioPlayer';

function ResultCard({ result, large }) {
  const { entity: { file_seq_id, filename, file_timestamp, image_url, audio_url, clip_offset_in_file }} = result;
  const gridConfig = `min-content min-content ${large ? 'min-content' : ''} 1fr`;
  const fullAudioUrl = `https://data.acousticobservatory.org/listen/${file_seq_id}`;

  return (
    <Card size="sm" fontSize="sm" data-testid="result-card">
      <CardBody as={Grid} gap={2} templateRows={gridConfig}>
        <Grid gap="1" templateColumns="1fr min-content">
          <Text textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">{ filename.split('/')[1] }</Text>
          <AudioPlayer audioSrc={audio_url} />
        </Grid>
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
        {large && (
          <Grid templateColumns="min-content 1fr" gap="1">
            <GridItem><b>Site:</b></GridItem>
            <GridItem>{ sitenameDisplay(result) }</GridItem>
            <GridItem><b>Recording time:</b></GridItem>
            <GridItem>{ formatDate(file_timestamp) }</GridItem>
            <GridItem><b>Result time:</b></GridItem>
            <GridItem>{ formatDate(file_timestamp + clip_offset_in_file) }</GridItem>
          </Grid>
        )}
        <GridItem alignSelf="end">
          {large ? (
            <Button as={Link} variant="link" href={fullAudioUrl} target="_blank" rightIcon={<MdOpenInNew />} size="sm">Full Recording</Button>
          ): (
            <IconButton as={Link} variant="link" href={fullAudioUrl} target="_blank" icon={<MdOpenInNew />} size="sm" title="Full Recording" display="inline" />
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
