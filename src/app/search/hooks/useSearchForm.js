import { useState } from 'react';

export default function useSearchForm() {
  const [ file, setFile ] = useState();
  const [ results, setResults ] = useState([]);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setResults([]);

    const formData  = new FormData();
    formData.append('audio_file', file);

    fetch('https://api.bioacoustics.ds.io/api/v1/search/', {
      method: 'POST',
      body: formData,
    })
      .then(r => r.json())
      .then(setResults)
      .finally(() => setIsSubmitting(false));
  };

  return {
    file,
    setFile,
    results,
    isSubmitting,
    handleFormSubmit
  };
}
