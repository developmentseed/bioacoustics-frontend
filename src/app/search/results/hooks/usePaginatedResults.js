import { useState } from 'react';
import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';

export default function usePaginatedResults(results) {
  const [ page, setPage ] = useState(1);
  const [ selectedSites, setSelectedSites ] = useState([]);

  const filterFunc = (res) => {
    const filters = [];
    if (selectedSites.length > 0) {
      filters.push(selectedSites.includes(res.entity.site_id));
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
    setSelectedSites,
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
