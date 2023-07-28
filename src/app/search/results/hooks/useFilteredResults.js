import { useMemo } from 'react';
import { LngLat } from 'mapbox-gl';

import { useSites } from '../../context/sites';
import { useAppState } from '../../context/appState';
import {
  SelectedSitesConfig,
  BboxFilterConfig,
  SelectedDatesConfig,
  SelectedTimesConfig,
  TopMatchPerRecordingConfig
} from './stateConfig';

export default function useFilteredResults(results) {
  const { sites } = useSites();
  const [ selectedSites, setSelectedSites ] = useAppState('selectedSites', SelectedSitesConfig);
  const [ bboxFilter, setBboxFilter] = useAppState('bboxFilter', BboxFilterConfig);
  const [ selectedDates, setSelectedDates ] = useAppState('selectedDates', SelectedDatesConfig);
  const [ selectedTimes, setSelectedTimes ] = useAppState('selectedTimes', SelectedTimesConfig);
  const [ topMatchPerRecording, setTopMatchPerRecording ] = useAppState('topMatchPerRecording', TopMatchPerRecordingConfig);

  const filteredResults = useMemo(
    () => {
      const recordingsInResults = [];
      const filterFunc = (res) => {
        const filters = [];
        if (selectedSites.length > 0) {
          filters.push(selectedSites.includes(res.entity.site_id));
        }
        if (bboxFilter) {
          const site = sites.find(({ id }) => id === res.entity.site_id);
          if (site) {
            const { custom_longitude, custom_latitude } = site;
            const siteLocation = new LngLat(custom_longitude, custom_latitude);
            filters.push(bboxFilter.contains(siteLocation));
          } else {
            filters.push(false);
          }
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
      return results.filter(filterFunc);
    },
    [results, selectedSites, bboxFilter, selectedDates, selectedTimes, topMatchPerRecording, sites] 
  );

  return {
    filteredResults,
    numMatches: filteredResults.length,
    selectedSites,
    setSelectedSites,
    selectedDates,
    setSelectedDates,
    selectedTimes,
    setSelectedTimes,
    bboxFilter,
    setBboxFilter,
    topMatchPerRecordingProps: {
      isChecked: topMatchPerRecording,
      onChange: e => setTopMatchPerRecording(e.target.checked)
    },
  };
}
