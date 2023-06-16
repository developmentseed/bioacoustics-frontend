import { useState } from 'react';
import { RESULTS_MAX, RESULTS_PAGE_SIZE } from '@/settings';

export default function useSearchForm() {
  const [ file, setFile ] = useState();
  const [ results, setResults ] = useState([]);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const pushToResults = (response) => {
    setResults(previousResults => {
      return [...previousResults, ...response].sort((a, b) => a.distance - b.distance);
    });
  };

  const fetchResults = (page) => {
    const limit = RESULTS_PAGE_SIZE;
    const offset = page * limit;

    const formData  = new FormData();
    formData.append('audio_file', file);
    formData.append('limit', limit);
    formData.append('offset', offset);

    return fetch('https://api.bioacoustics.ds.io/api/v1/search/', {
      method: 'POST',
      body: formData,
    })
      .then(r => r.json())
      .then(pushToResults);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setResults([]);

    const numPages = RESULTS_MAX / RESULTS_PAGE_SIZE;
    Promise.any(
      Array(numPages)
        .fill()
        .map((_, page) => fetchResults(page))
    ).finally(() => setIsSubmitting(false));
  };

  return {
    file,
    setFile,
    results,
    isSubmitting,
    handleFormSubmit
  };
}
