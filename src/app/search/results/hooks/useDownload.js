import { useMemo, useState } from 'react';

export default function useDownload(results) {
  const [ selectedResults, setSelectedResults ] = useState([]);

  const toggleSelect = (id) => {
    if (selectedResults.includes(id)) {
      setSelectedResults(selectedResults.filter(i => i !== id));
    } else {
      setSelectedResults(prev => [...prev, id]);
    }
  };

  const clearSelect = () => setSelectedResults([]);

  const downloadLink = useMemo(() => {
    const resultSet = selectedResults.length > 0
      ? results.filter((result) => selectedResults.includes(result.entity.audio_url))
      : results;
    const csvResults = resultSet.map(
        ({ entity }) => [
          entity.filename,
          entity.file_seq_id,
          new Date(entity.file_timestamp * 1000).toISOString(),
          entity.site_name,
          entity.subsite_name,
          entity.site_id,
          entity.clip_offset_in_file,
          entity.audio_url
        ]
      )
      .map(line => `${line.join(',')}\n`);

    const content = `Filename,FileId,Datetime,Site,Subsite,SiteId,Offset,AudioLink\n${csvResults.join('')}`;
    const blob = new Blob([content], { type: 'text/csv' });
    return window.URL.createObjectURL(blob);
  }, [results, selectedResults]);

  return {
    selectedResults,
    toggleSelect,
    downloadLink,
    clearSelect
  };
}
