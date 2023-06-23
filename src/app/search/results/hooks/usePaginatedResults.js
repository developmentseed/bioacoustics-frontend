import { useState } from 'react';
import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';

export default function usePaginatedResults(results) {
  const [ page, setPage ] = useState(1);

  const resultPage = results.slice(RESULTS_DISPLAY_PAGE_SIZE * (page - 1), RESULTS_DISPLAY_PAGE_SIZE * page);
  return {
    page,
    resultPage,
    previousPageProps: {
      isDisabled: page === 1,
      onClick: () => setPage(page - 1)
    },
    nextPageProps: {
      isDisabled: page === Math.ceil(results.length / RESULTS_DISPLAY_PAGE_SIZE),
      onClick: () => setPage(page + 1)
    }
  };
}
