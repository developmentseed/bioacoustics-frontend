import T from 'prop-types';
import { Button, Card, CardBody, Flex, Grid, GridItem, IconButton, Image, Link, Text } from '@chakra-ui/react';
import { MdPlayArrow, MdOpenInNew } from 'react-icons/md';

import { TMatch } from '@/types';
import { formatDate } from '@/utils';

function ResultCard({ result, large }) {
  const { id, entity: { site_name, file_timestamp, image_url }} = result;
  const gridConfig = `min-content min-content ${large ? 'min-content' : ''} 1fr`;

  return (
    <Card size="sm" fontSize="sm" data-testid="result-card">
      <CardBody as={Grid} gap={2} templateRows={gridConfig}>
        <Flex>
          <Text flex="1">{ id }</Text> {/* TODO: Replace with file name */}
          <IconButton
            type="button"
            variant="primary"
            borderRadius="full"
            size="xs"
            icon={<MdPlayArrow />}
            aria-label="Play"
            title="Play"
          />
        </Flex>
        <Image
          src={image_url}
          alt="Spectrogram" // TODO
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
            <GridItem>{ site_name }</GridItem>
            <GridItem><b>Date:</b></GridItem>
            <GridItem>{ formatDate(file_timestamp) }</GridItem>
          </Grid>
        )}
        <GridItem alignSelf="end">
          {large ? (
            <Button as={Link} variant="link" href="#" rightIcon={<MdOpenInNew />} size="sm">Full Recording</Button>
          ): (
            <IconButton as={Link} variant="link" href="#" icon={<MdOpenInNew />} size="sm" title="Full Recording" display="inline" />
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
      {results.map((result) => <ResultCard key={result.file_seq_id} result={result} large={large} />)}
    </Grid>
  );
}


GridView.propTypes = {
  results: T.arrayOf(TMatch),
  large: T.bool
};
