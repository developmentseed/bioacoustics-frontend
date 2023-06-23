import { useState } from 'react';

export default function useDownload(results) {
  const [ selectedResults, setSelectedResults ] = useState([]);

  const toggleSelect = (id) => {
    if (selectedResults.includes(id)) {
      setSelectedResults(selectedResults.filter(i => i !== id));
    } else {
      setSelectedResults(prev => [...prev, id]);
    }
  };

  return {
    selectedResults,
    toggleSelect
  };
}
