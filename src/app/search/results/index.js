import { useState } from 'react';
import T from 'prop-types';
import { Box, ButtonGroup, Container, Flex, Heading, IconButton, Spacer, Text } from '@chakra-ui/react';
import { MdMenu, MdGridView } from 'react-icons/md';

import { Loading } from '@/components';
import { TMatch } from '@/types';
import TableView from './TableView';
import GridView from './GridView';

const VIEWS = {
  table: 1,
  grid: 2
};

export default function Results({ isLoading, results }) {
  const [ view, setView ] = useState(VIEWS.table);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container mt="10" maxW="container.xl">
      <Heading as="h2" size="base">Results</Heading>
      {results.length > 0 ? (
        <>
          <Flex mb="2">
            <Box>
            Showing { results.length } matches
            </Box>
            <Spacer />
            <Box>
            <ButtonGroup isAttached variant="outline">
              <IconButton
                variant={view === VIEWS.table ? 'primary': 'outline'}
                icon={<MdMenu />}
                type="button"
                size="xs"
                aria-label="View results in table"
                onClick={() => setView(VIEWS.table)}
              />
              <IconButton
                variant={view === VIEWS.grid ? 'primary': 'outline'}
                icon={<MdGridView />}
                type="button"
                size="xs"
                aria-label="View results in grid"
                onClick={() => setView(VIEWS.grid)}
              />
            </ButtonGroup>
            </Box>
          </Flex>
          {view === VIEWS.table && <TableView results={results} />}
          {view === VIEWS.grid && <GridView results={results} />}
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
