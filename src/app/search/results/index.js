import { useState, useEffect } from 'react';
import T from 'prop-types';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { MdMenu, MdGridView, MdGridOn, MdKeyboardArrowDown } from 'react-icons/md';

import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';
import { Loading } from '@/components';
import { TMatch } from '@/types';
import TableView from './TableView';
import GridView from './GridView';
import usePaginatedResults from './hooks/usePaginatedResults';
import { useSites } from '../context/sites';

const VIEWS = {
  grid_lg: 1,
  grid_sm: 2,
  table: 3,
};

export default function Results({ isLoading, results }) {
  const [view, setView] = useState(VIEWS.grid_lg);
  const { page, resultPage, numMatches, previousPageProps, nextPageProps, setSelectedSites } = usePaginatedResults(results);
  const { sites } = useSites();

  useEffect(() => window.scrollTo({
    top: 450,
    left: 0,
    behavior: 'smooth',
  }), [resultPage]);

  if (isLoading) {
    return <Loading />;
  }

  const resultStart = (page - 1) * RESULTS_DISPLAY_PAGE_SIZE + 1;
  const resultEnd = Math.min(resultStart + RESULTS_DISPLAY_PAGE_SIZE - 1, numMatches);
  return (
    <Box py="10" bg="blackAlpha.50" minH="100%" flex="1">
      <Container maxW="container.xl" display="flex" flexDirection="column" gap={4}>
        <Heading as="h2" size="base">Results</Heading>
        {results.length > 0 ? (
          <>
            <HStack>
              <Text textTransform="uppercase" fontSize="sm">Filters</Text>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} size="sm" variant="outline" rightIcon={<MdKeyboardArrowDown />}>
                  Sites
                </MenuButton>
                <MenuList height="200px" overflowY="scroll" zIndex="11" fontSize="sm">
                  <MenuOptionGroup type="checkbox" onChange={setSelectedSites}>
                    {sites.map(({ id, name }) => <MenuItemOption key={id} value={id}>{name}</MenuItemOption>)}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </HStack>
            <Flex mb="2">
              <Box>
                View  <b>{resultStart} - {resultEnd}</b> of { numMatches } results
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
