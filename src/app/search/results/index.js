import { useState } from 'react';
import T from 'prop-types';
import { Box, ButtonGroup, Container, Flex, Heading, IconButton, Spacer, Text } from '@chakra-ui/react';
import { MdMenu, MdGridView, MdGridOn } from 'react-icons/md';

import { Loading } from '@/components';
import { TMatch } from '@/types';
import TableView from './TableView';
import GridView from './GridView';

const VIEWS = {
  table: 1,
  grid_sm: 2,
  grid_lg: 3,
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
                variant={view === VIEWS.grid_lg ? 'primary': 'outline'}
                icon={<MdGridView />}
                type="button"
                size="xs"
                aria-label="View results in large grid"
                onClick={() => setView(VIEWS.grid_lg)}
              />
              <IconButton
                variant={view === VIEWS.grid_sm ? 'primary': 'outline'}
                icon={<MdGridOn />}
                type="button"
                size="xs"
                aria-label="View results in small grid"
                onClick={() => setView(VIEWS.grid_sm)}
              />
            </ButtonGroup>
            </Box>
          </Flex>
          {view === VIEWS.table && <TableView results={results} />}
          {[VIEWS.grid_sm, VIEWS.grid_lg].includes(view) && <GridView results={results} large={view === VIEWS.grid_lg} />}
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
