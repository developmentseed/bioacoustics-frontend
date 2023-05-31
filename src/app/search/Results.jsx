import T from 'prop-types';
import { Container, Heading, Text } from '@chakra-ui/react';
import { Loading } from '@/components';
import { TMatch } from '@/types';

export default function Results({ isLoading, results }) {
  if (isLoading) {
    return <Loading />;
  }
  return (
    <Container mt="10">
      <Heading as="h2" size="base">Results</Heading>
      {results.length > 0 ? (
        <>
          <Text mb="2">Showing { results.length } matches</Text>
          <table>
            <tr>
              <th>ID</th>
              <th>Distance</th>
              <th>Site Name</th>
              <th>Subsite Name</th>
              <th>Timestamp</th>
            </tr>
            {results.map((result) => {
              const { id, distance, entity: { site_name, subsite_name, file_timestamp } } = result;
              return (
                <tr key={id}>
                  <td>{ id }</td>
                  <td>{ distance }</td>
                  <td>{ site_name }</td>
                  <td>{ subsite_name }</td>
                  <td>{ file_timestamp }</td>
                </tr>
              );
            })}
          </table>
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
