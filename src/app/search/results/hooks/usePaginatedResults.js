import { useState } from 'react';
import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';

export default function usePaginatedResults(results) {
  const [ page, setPage ] = useState(1);
  const [ selectedSites, setSelectedSites ] = useState([]);
  const [ selectedDates, setSelectedDates ] = useState([]);
  const [ selectedTimes, setSelectedTimes ] = useState([0, 24]);

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
    
    if (filters.length > 0)
      return filters.every(x => x);
    else {
      return true;
    }
  };

  const filteredResults = results.filter(filterFunc);
  const numMatches = filteredResults.length;
  const resultPage = filteredResults.slice(RESULTS_DISPLAY_PAGE_SIZE * (page - 1), RESULTS_DISPLAY_PAGE_SIZE * page);

  return {
    page,
    resultPage,
    numMatches,
    selectedSites,
    setSelectedSites,
    selectedDates,
    setSelectedDates,
    selectedTimes,
    setSelectedTimes,
    previousPageProps: {
      isDisabled: page === 1,
      onClick: () => setPage(page - 1)
    },
    nextPageProps: {
      isDisabled: page === Math.ceil(numMatches / RESULTS_DISPLAY_PAGE_SIZE),
      onClick: () => setPage(page + 1)
    }
  };
}
