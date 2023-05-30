import { useState } from 'react';

export default function useSearchForm() {
  const [ file, setFile ] = useState();
  const [ results, setResults ] = useState([]);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const handleFileSelect = (e) => setFile(e.target.files[0]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

  };

  return {
    file,
    results,
    isSubmitting,
    handleFileSelect,
    handleFormSubmit
  };
}
