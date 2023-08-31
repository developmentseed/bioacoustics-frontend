import { useState, useEffect } from 'react';
import T from 'prop-types';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  IconButton,
  NumberInput,
  NumberInputField,
  Spacer,
  Stack,
  Text,
} from '@chakra-ui/react';
import { MdMenu, MdGridView, MdGridOn, MdClose, MdMap, MdChevronLeft, MdKeyboardDoubleArrowLeft, MdChevronRight, MdKeyboardDoubleArrowRight } from 'react-icons/md';

import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';
import { Loading } from '@/components';
import { TMatch } from '@/types';
import TableView from './TableView';
import GridView from './GridView';
import { SitesFilter, DateFilter, TimeFilter, Chips, TopResultCheckbox } from './components/filters';
import { usePaginatedResults, useDownload, useFilteredResults, useCapabilities } from './hooks';
import MapView from './MapView';
import { ShareButton } from './components';

const VIEWS = {
  grid_lg: 1,
  grid_sm: 2,
  table: 3,
};

export default function Results({ file, isLoading, results }) {
  const [showMap, setShowMap] = useState(false);
  const [view, setView] = useState(VIEWS.grid_lg);
  const { canStoreFile } = useCapabilities();
  const {
    filteredResults,
    numMatches,
    selectedSites,
    setSelectedSites,
    selectedDates,
    setSelectedDates,
    selectedTimes,
    setSelectedTimes,
    topMatchPerRecordingProps,
    bboxFilter,
    setBboxFilter
  } = useFilteredResults(results);
  const {
    page,
    numPages,
    resultPage,
    firstPageProps,
    previousPageProps,
    nextPageProps,
    lastPageProps,
    pageInputProps
  } = usePaginatedResults(filteredResults);
  const { selectedResults, toggleSelect, clearSelect, downloadLink } = useDownload(filteredResults);

  // Scroll to top of results on page change
  useEffect(() => window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  }), [page]);

  // Clear selected results when the filter changes
  useEffect(clearSelect, [selectedSites, selectedDates, selectedTimes, clearSelect]);

  // Show the map if the page is initialised with the bbox query param
  useEffect(() => {
    if (bboxFilter && !showMap) {
      setShowMap(true);
    }
  }, [showMap, bboxFilter]);

  if (isLoading) {
    return <Loading />;
  }

  const resultStart = (page - 1) * RESULTS_DISPLAY_PAGE_SIZE + 1;
  const resultEnd = Math.min(resultStart + RESULTS_DISPLAY_PAGE_SIZE - 1, numMatches);

  return (
    <Box py="10" bg="blackAlpha.50" minH="100%" flex="1">
      <Container maxW="container.xl" minH="100%" display="flex" flexDirection="column" gap={4}>
        <Flex gap="2">
          <Heading as="h2" size={['md', 'lg']} flex="1">Results</Heading>
          {results.length > 0 && (
            <>
              {canStoreFile && <ShareButton file={file} />}
              <Button variant="primary" size="sm" as="a" href={downloadLink}>Download</Button>
            </>
          )}
        </Flex>
        {results.length > 0 ? (
          <>
            <Stack direction={['column', null, 'row']} alignItems={['stretch', null, 'center']}>
              <Text textTransform="uppercase" fontSize="sm">Filters</Text>
              <SitesFilter selectedSites={selectedSites} setSelectedSites={setSelectedSites} />
              <DateFilter selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
              <TimeFilter selectedTimes={selectedTimes} setSelectedTimes={setSelectedTimes} />
              <TopResultCheckbox mt={[2, 2, 0]} {...topMatchPerRecordingProps} />
            </Stack>
            <Chips
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
            />
            {numMatches > 0 && (
              <Flex mb="2" alignItems="center" wrap="wrap">
                <Flex alignItems="center" wrap="wrap">
                  <Text fontSize="sm" as="span">View <b>{resultStart} - {resultEnd}</b> of { numMatches } results</Text>
                  {selectedResults.length > 0 && (
                    <Flex alignItems="center">
                      <Text fontSize="sm" as="span" mx="3" pl={[0, 3]} borderLeft={[null, '1px solid']} borderColor={[null, 'neutral.100']}>{selectedResults.length} selected</Text>
                      <Button onClick={clearSelect} variant="link" textTransform="uppercase" letterSpacing="1px" fontWeight="normal" size="sm" leftIcon={<MdClose />}>Clear</Button>
                    </Flex>
                  )}
                </Flex>
                <Spacer />
                <Flex gap="2" flexBasis={['100%', 'initial']} mt={[2, 0]}>
                  <ButtonGroup isAttached variant="outline" background="white">
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
                      display={['none', 'inline-flex']}
                      aria-label="View results in table"
                      onClick={() => setView(VIEWS.table)}
                    />
                  </ButtonGroup>
                  <Button leftIcon={<MdMap />} size="xs" variant="outline" background="white" onClick={() => setShowMap(!showMap)}>{showMap ? 'Hide map' : 'Show map'}</Button>
                </Flex>
              </Flex>
            )}
            <Flex gap="5" direction={['column-reverse', null, 'row']} alignItems="stretch">
              <Box flex="1">
              {numMatches > 0 ? (
                <>
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
                </>
              ) : (
                  <Text fontWeight="bold">No results match the selected filters.</Text>
              )}
              </Box>
              {showMap && <MapView results={resultPage} bboxFilter={bboxFilter} setBboxFilter={setBboxFilter} />}
            </Flex>
            <Flex my="5" gap="4" alignItems="center" justifyContent="center">
              <ButtonGroup isAttached variant="outline" size="sm" background="white">
                <IconButton display={['inline-flex', 'none']} icon={<MdKeyboardDoubleArrowLeft />} {...firstPageProps}>First page</IconButton>
                <Button display={['none', 'inline-flex']} {...firstPageProps}>First page</Button>
                <IconButton display={['inline-flex', 'none']} {...previousPageProps} icon={<MdChevronLeft />} />
                <Button display={['none', 'inline-flex']} {...previousPageProps}>Previous</Button>
              </ButtonGroup>
              <Flex fontSize="sm" gap="1" alignItems="center" whiteSpace="pre">Page 
                <NumberInput {...pageInputProps} w="12" size="sm" clampValueOnBlur={false} bgColor={pageInputProps.isInvalid && 'red.100'} background="white">
                  <NumberInputField px="0" textAlign="center" />
                </NumberInput>
                of {numPages}
              </Flex>
              <ButtonGroup isAttached variant="outline" size="sm" background="white">
                <IconButton display={['inline-flex', 'none']} icon={<MdChevronRight />} {...nextPageProps} />
                <Button display={['none', 'inline-flex']} {...nextPageProps}>Next</Button>
                <IconButton display={['inline-flex', 'none']} icon={<MdKeyboardDoubleArrowRight />} {...lastPageProps} />
                <Button display={['none', 'inline-flex']} {...lastPageProps}>Last page</Button>
              </ButtonGroup>
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
  file: T.object
};
