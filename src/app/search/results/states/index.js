import { LngLatBounds } from 'mapbox-gl';
import { DelimitedNumericArrayParam, NumberParam, withDefault } from 'use-query-params';

export const NumericArray = withDefault(DelimitedNumericArrayParam, []);
export const TimeRange = withDefault(DelimitedNumericArrayParam, [0, 24]);

export const DateRange = {
  default: [],
  encode(value) {
    if (value.length === 0) {
      return null;
    }
    return value.map(d => d.toISOString().slice(0,10)).join(',');
  },
  decode(strValue) {
    if (!strValue) {
      return [];
    }
    return strValue.split(',').map(d => new Date(d));
  }
};

export const Bbox = {
  encode(value) {
    if (!value) {
      return null;
    }
    return JSON.stringify(value.toArray());
  },
  decode(strValue) {
    if (!strValue) {
      return;
    }
    const bbox = JSON.parse(strValue);
    return new LngLatBounds(bbox[0], bbox[1]);
  }
};

export const Page = withDefault(NumberParam, 1);
