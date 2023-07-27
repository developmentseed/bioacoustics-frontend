import { useMemo } from 'react';
import { LngLat, LngLatBounds } from 'mapbox-gl';

import { useSites } from '../../context/sites';
import { useAppState } from '../../context/appState';

const selectedSitesConfig = {
  default: [],
  encode: (value) => {
    return value.join(',');
  },
  decode: (value) => {
    return value.split('').map(parseInt);
  }
};

const bboxFilterConfig = {
  encode: (value) => {
    if (!value) {
      return;
    }
    return JSON.stringify(value.toArray());
  },
  decode: (value) => {
    if (!value) {
      return;
    }
    const bbox = JSON.parse(value);
    return new LngLatBounds(bbox[0], bbox[1]);
  }
};

const selectedDatesConfig = {
  default: [],
  encode: (value) => {
    if (value.length === 0) {
      return null;
    }
    return value.map(d => d.toISOString().slice(0,10)).join(',');
  },
  decode: (value) => {
    if (!value) {
      return [];
    }
    return value.split(',').map(d => new Date(d));
  }
};
const selectedTimesConfig = {
  default: [0, 24],
  encode: (value) => {
    return value.join(',');
  },
  decode: (value) => {
    return value.split('').map(parseInt);
  }
};
const topMatchPerRecordingConfig = {
  default: false,
  encode: (value) => {
    return value ? '1' : '0';
  },
  decode: (value) => {
    return value === '1';
  }
};

export default function useFilteredResults(results) {
  const { sites } = useSites();
  const [ selectedSites, setSelectedSites ] = useAppState('selectedSites', selectedSitesConfig);
  const [ bboxFilter, setBboxFilter] = useAppState('bboxFilter', bboxFilterConfig);
  const [ selectedDates, setSelectedDates ] = useAppState('selectedDates', selectedDatesConfig);
  const [ selectedTimes, setSelectedTimes ] = useAppState('selectedTimes', selectedTimesConfig);
  const [ topMatchPerRecording, setTopMatchPerRecording ] = useAppState('topMatchPerRecording', topMatchPerRecordingConfig);

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
    setBboxFilter,
    topMatchPerRecordingProps: {
      isChecked: topMatchPerRecording,
      onChange: e => setTopMatchPerRecording(e.target.checked)
    },
  };
}
