import { useState } from 'react';
import T from 'prop-types';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { MdMenu, MdGridView, MdGridOn } from 'react-icons/md';

import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';
import { Loading } from '@/components';
import { TMatch } from '@/types';
import TableView from './TableView';
import GridView from './GridView';
import usePaginatedResults from './hooks/usePaginatedResults';

const VIEWS = {
  grid_lg: 1,
  grid_sm: 2,
  table: 3,
};

export default function Results({ isLoading, results }) {
  const [view, setView] = useState(VIEWS.grid_lg);
  const { page, resultPage, previousPageProps, nextPageProps } = usePaginatedResults(results);

  if (isLoading) {
    return <Loading />;
  }

  const resultStart = (page - 1) * RESULTS_DISPLAY_PAGE_SIZE + 1;
  const resultEnd = resultStart + RESULTS_DISPLAY_PAGE_SIZE - 1;
  return (
    <Box py="10" bg="blackAlpha.50" minH="100%" flex="1">
      <Container maxW="container.xl" display="flex" flexDirection="column" gap={4}>
        <Heading as="h2" size="base">Results</Heading>
        {results.length > 0 ? (
          <>
            <Flex mb="2">
              <Box>
                View  <b>{resultStart} - {resultEnd}</b> of { results.length } results
              </Box>
              <Spacer />
              <Box>
              <ButtonGroup isAttached variant="outline">
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
                <IconButton
                  variant={view === VIEWS.table ? 'primary': 'outline'}
                  icon={<MdMenu />}
                  type="button"
                  size="xs"
                  aria-label="View results in table"
                  onClick={() => setView(VIEWS.table)}
                />
              </ButtonGroup>
              </Box>
            </Flex>
            {view === VIEWS.table && <TableView results={resultPage} />}
            {[VIEWS.grid_sm, VIEWS.grid_lg].includes(view) && <GridView results={resultPage} large={view === VIEWS.grid_lg} />}
            <Flex my="5">
              <Button {...previousPageProps} variant="outline">Previous</Button>
              <Spacer />
              <Button {...nextPageProps} variant="outline">Next</Button>
            </Flex>
          </>
        ) : (
          <Text>Upload and submit audio query to view results</Text>
        )}
      </Container>
    </Box>
  );
}

Results.propTypes = {
  isLoading: T.bool,
  results: T.arrayOf(TMatch),
};
