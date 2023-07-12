import { useEffect, useState } from 'react';

import { RESULTS_DISPLAY_PAGE_SIZE } from '@/settings';

export default function usePaginatedResults(results) {
  const [ page, setPage ] = useState(1);
  const [ pageInputValue, setPageInputValue ] = useState(1);

  // Reset page when the filters were changed
  useEffect(() => {
    setPage(1);
  }, [results]);

  // Update the input value when the page changes
  useEffect(() => {
    setPageInputValue(page);
  }, [page]);

  
  const resultPage = results.slice(RESULTS_DISPLAY_PAGE_SIZE * (page - 1), RESULTS_DISPLAY_PAGE_SIZE * page);
  const numPages = Math.ceil(results.length / RESULTS_DISPLAY_PAGE_SIZE) || 1;

  return {
    page,
    numPages,
    resultPage,
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
