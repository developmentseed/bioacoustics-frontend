import T from 'prop-types';
import { Container, Heading, Text } from '@chakra-ui/react';
import { Loading } from '@/components';
import { TMatch } from '@/types';
import TableView from './TableView';

export default function Results({ isLoading, results }) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container mt="10" maxW="container.xl">
      <Heading as="h2" size="base">Results</Heading>
      {results.length > 0 ? (
        <>
          <Text mb="2">Showing { results.length } matches</Text>
          <TableView results={results} />
        </>
      ) : (
        <Text>Upload audio to view results</Text>
      )}
    </Container>
  );
}

Results.propTypes = {
  isLoading: T.bool,
  results: T.arrayOf(TMatch)
};
