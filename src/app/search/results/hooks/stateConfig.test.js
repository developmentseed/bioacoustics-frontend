import { LngLatBounds } from 'mapbox-gl';
import {
  PageConfig,
  SelectedSitesConfig,
  BboxFilterConfig,
  SelectedDatesConfig,
  SelectedTimesConfig,
  TopMatchPerRecordingConfig
} from './stateConfig';

describe('PageConfig', () => {
  it('decodes number', () => {
    expect(PageConfig.decode('1')).toEqual(1);
  });

  it('encodes number', () => {
    expect(PageConfig.encode(1)).toEqual('1');
  });
});

describe('SelectedSitesConfig', () => {
  it('decodes array', () => {
    expect(SelectedSitesConfig.decode('1,2,3')).toEqual([1, 2, 3]);
  });

  it('encodes array', () => {
    expect(SelectedSitesConfig.encode([1, 2, 3])).toEqual('1,2,3');
  });
});

describe('BboxFilterConfig', () => {
  it('decodes string to LngLatBounds', () => {
    const result = BboxFilterConfig.decode('12,50,13,51');
    expect(result.getSouthWest()).toEqual({lng: 12, lat: 50});
    expect(result.getNorthEast()).toEqual({lng: 13, lat: 51});
  });

  it('encodes LngLatBounds to string', () => {
    const bbox = new LngLatBounds([12,50],[13,51]);
    expect(BboxFilterConfig.encode(bbox)).toEqual('12,50,13,51');
  });

});

describe('SelectedDatesConfig', () => {
  it('decodes string to date array', () => {
    const result = SelectedDatesConfig.decode('2012-01-03,2012-04-04');
    expect(result.length).toEqual(2);
    expect(result[0].toString()).toEqual(new Date('2012-01-03').toString());
    expect(result[1].toString()).toEqual(new Date('2012-04-04').toString());
  });

  it('encodes bbox object', () => {
    const result = SelectedDatesConfig.encode([new Date('2012-01-03'), new Date('2012-04-04')]);
    expect(result).toEqual('2012-01-03,2012-04-04');
  });
});

describe('SelectedTimesConfig', () => {
  it('decodes array', () => {
    expect(SelectedTimesConfig.decode('1,15')).toEqual([1, 15]);
  });

  it('encodes array', () => {
    expect(SelectedTimesConfig.encode([1, 15])).toEqual('1,15');
  });
});

describe('TopMatchPerRecordingConfig', () => {
  it('decodes number to bool', () => {
    expect(TopMatchPerRecordingConfig.decode('1')).toEqual(true);
    expect(TopMatchPerRecordingConfig.decode('0')).toEqual(false);
  });

  it('encodes bool to number', () => {
    expect(TopMatchPerRecordingConfig.encode(true)).toEqual('1');
    expect(TopMatchPerRecordingConfig.encode(false)).toEqual('0');
  });
});
