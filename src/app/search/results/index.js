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
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { MdMenu, MdGridView, MdGridOn, MdClose, MdMap } from 'react-icons/md';

import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';
import { Loading } from '@/components';
import { TMatch } from '@/types';
import TableView from './TableView';
import GridView from './GridView';
import { SitesFilter, DateFilter, TimeFilter, Chips, TopResultCheckbox } from './components/filters';
import { usePaginatedResults, useDownload } from './hooks';
import MapView from './MapView';

const VIEWS = {
  grid_lg: 1,
  grid_sm: 2,
  table: 3,
};

export default function Results({ isLoading, results }) {
  const [showMap, setShowMap] = useState(false);
  const [view, setView] = useState(VIEWS.grid_lg);
  const {
    page,
    resultPage,
    numMatches,
    firstPageProps,
    previousPageProps,
    nextPageProps,
    lastPageProps,
    selectedSites,
    setSelectedSites,
    selectedDates,
    setSelectedDates,
    selectedTimes,
    setSelectedTimes,
    topMatchPerRecordingProps,
  } = usePaginatedResults(results);
  const { selectedResults, toggleSelect, clearSelect, downloadLink } = useDownload(results);

  // Scroll to top of results on page change
  useEffect(() => window.scrollTo({
    top: 450,
    left: 0,
    behavior: 'smooth',
  }), [page]);

  // Clear selected results when the filter changes
  useEffect(clearSelect, [selectedSites, selectedDates, selectedTimes, clearSelect]);

  if (isLoading) {
    return <Loading />;
  }

  const resultStart = (page - 1) * RESULTS_DISPLAY_PAGE_SIZE + 1;
  const resultEnd = Math.min(resultStart + RESULTS_DISPLAY_PAGE_SIZE - 1, numMatches);

  return (
    <Box py="10" bg="blackAlpha.50" minH="100%" flex="1">
      <Container maxW="container.xl" display="flex" flexDirection="column" gap={4}>
        <Flex>
          <Heading as="h2" size="base" flex="1">Results</Heading>
          {results.length > 0 && <Button variant="primary" size="sm" as="a" href={downloadLink}>Download</Button>}
        </Flex>
        {results.length > 0 ? (
          <>
            <HStack>
              <Text textTransform="uppercase" fontSize="sm">Filters</Text>
              <SitesFilter selectedSites={selectedSites} setSelectedSites={setSelectedSites} />
              <DateFilter selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
              <TimeFilter selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} />
              <TopResultCheckbox {...topMatchPerRecordingProps} />
            </HStack>
            <Chips
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
            />
            {numMatches > 0 && (
              <Flex mb="2">
                <Flex alignItems="center">
                  <Text as="span">View <b>{resultStart} - {resultEnd}</b> of { numMatches } results</Text>
                  {selectedResults.length > 0 && (
                    <>
                      <Text as="span" mx="3" pl="3" borderLeft="1px solid" borderColor="neutral.100">{selectedResults.length} selected</Text>
                      <Button onClick={clearSelect} variant="link" textTransform="uppercase" letterSpacing="1px" fontWeight="normal" size="sm" leftIcon={<MdClose />}>Clear</Button>
                    </>
                  )}
                </Flex>
                <Spacer />
                <Flex gap="2">
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
                  <Button leftIcon={<MdMap />} size="xs" variant="outline" onClick={() => setShowMap(!showMap)}>{showMap ? 'Hide map' : 'Show map'}</Button>
                </Flex>
              </Flex>
            )}
            <Flex gap="5">
              {numMatches > 0 ? (
                <>
                  <Box flex="1">
                    {view === VIEWS.table && (
                      <TableView
                        results={resultPage}
                        selectedResults={selectedResults}
                        toggleSelect={toggleSelect}
                        narrow={showMap}
                      />
                    )}
                    {[VIEWS.grid_sm, VIEWS.grid_lg].includes(view) && (
                      <GridView
                        results={resultPage}
                        large={view === VIEWS.grid_lg}
                        selectedResults={selectedResults}
                        toggleSelect={toggleSelect}
                      />
                    )}
                  </Box>
                  {showMap && <MapView results={resultPage} />}
                </>
              ) : (
                <Box fontWeight="bold">
                  No results match the selected filters. 
                </Box>
              )}
            </Flex>
            <Flex my="5" gap="5" alignItems="center">
              <Spacer />
              <ButtonGroup isAttached variant="outline" size="sm">
                <Button {...firstPageProps}>First page</Button>
                <Button {...previousPageProps}>Previous</Button>
              </ButtonGroup>
              <ButtonGroup isAttached variant="outline" size="sm">
                <Button {...nextPageProps}>Next</Button>
                <Button {...lastPageProps}>Last page</Button>
              </ButtonGroup>
              <Spacer />
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
