import { useEffect, useState } from 'react';
import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';

export default function usePaginatedResults(results) {
  const [ page, setPage ] = useState(1);
  const [ pageInputValue, setPageInputValue ] = useState(1);
  const [ selectedSites, setSelectedSites ] = useState([]);
  const [ selectedDates, setSelectedDates ] = useState([]);
  const [ selectedTimes, setSelectedTimes ] = useState([0, 24]);
  const [ topMatchPerRecording, setTopMatchPerRecording ] = useState(false);

  // Reset page when the filters were changed
  useEffect(() => {
    setPage(1);
  }, [selectedSites, selectedDates, selectedTimes]);

  const recordingsInResults = [];
  // Update the input value when the page
  useEffect(() => {
    setPageInputValue(page);
  }, [page]);

  const filterFunc = (res) => {
    const filters = [];
    if (selectedSites.length > 0) {
      filters.push(selectedSites.includes(res.entity.site_id));
    }
    if (selectedDates.length > 0) {
      const date = new Date(res.entity.file_timestamp * 1000 + res.entity.clip_offset_in_file);
      filters.push(date >= selectedDates[0]);
      selectedDates[1] && filters.push(date <= selectedDates[1]);
    }
    if (selectedTimes[0] !== 0 || selectedTimes[1] !== 24) {
      const date = new Date(res.entity.file_timestamp * 1000 + res.entity.clip_offset_in_file);
      const hour = date.getUTCHours();
      filters.push(selectedTimes[0] <= hour && selectedTimes[1] >= hour);
    }
    if (topMatchPerRecording) {
      if (!recordingsInResults.includes(res.entity.filename)) {
        recordingsInResults.push(res.entity.filename);
        filters.push(true);
      } else {
        filters.push(false);
      }
    }
    
    if (filters.length > 0)
      return filters.every(x => x);
    else {
      return true;
    }
  };

  const filteredResults = results.filter(filterFunc);
  const numMatches = filteredResults.length;
  const resultPage = filteredResults.slice(RESULTS_DISPLAY_PAGE_SIZE * (page - 1), RESULTS_DISPLAY_PAGE_SIZE * page);

  const numPages = Math.ceil(numMatches / RESULTS_DISPLAY_PAGE_SIZE) || 1;

  return {
    page,
    numPages,
    resultPage,
    numMatches,
    selectedSites,
    setSelectedSites,
    selectedDates,
    setSelectedDates,
    selectedTimes,
    setSelectedTimes,
    firstPageProps: {
      isDisabled: page === 1,
      onClick: () => setPage(1)
    },
    previousPageProps: {
      isDisabled: page === 1,
      onClick: () => setPage(page - 1)
    },
    nextPageProps: {
      isDisabled: page === numPages,
      onClick: () => setPage(page + 1)
    },
    topMatchPerRecordingProps: {
      isChecked: topMatchPerRecording,
      onChange: e => setTopMatchPerRecording(e.target.checked)
    },
    lastPageProps: {
      isDisabled: page === numPages,
      onClick: () => setPage(numPages)
    },
    pageInputProps: {
      value: pageInputValue,
      min: 1,
      max: numPages,
      isInvalid: pageInputValue < 1 || pageInputValue > numPages,
      onChange: setPageInputValue,
      onKeyUp: (e) => {
        const { value } = e.target;
        if (e.code === 'Enter' && value >= 1 && value <= numPages ) {
          setPage(value);
        }
      },
      onBlur: () => setPageInputValue(page)
    }
  };
}
