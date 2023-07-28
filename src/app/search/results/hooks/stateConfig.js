import { LngLatBounds } from 'mapbox-gl';

export const PageConfig = {
  default: 1,
  encode: (value) => value.toString(),
  decode: (value) => parseInt(value)
};

export const SelectedSitesConfig = {
  default: [],
  encode: (value) => value.join(','),
  decode: (value) => value.split(',').map(v => parseInt(v))
};

export const BboxFilterConfig = {
  encode: (value) => {
    if (!value) return;
    return JSON.stringify(value.toArray().flat()).slice(1, -1);
  },
  decode: (value) => {
    if (!value) return;
    const bbox = value.split(',').map(v => parseInt(v));
    return new LngLatBounds(bbox);
  }
};

export const SelectedDatesConfig = {
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

export const SelectedTimesConfig = {
  default: [0, 24],
  encode: (value) => value.join(','),
  decode: (value) => value.split(',').map(v => parseInt(v))
};

export const TopMatchPerRecordingConfig = {
  default: false,
  encode: (value) => value ? '1' : '0',
  decode: (value) => value === '1'
};
