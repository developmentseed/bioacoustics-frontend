import { renderHook, act } from '@testing-library/react';
import { SitesProvider } from '../../context/sites';
import useFilteredResults from './useFilteredResults';

const results = Array(72).fill(0).map((_, i) => ({
  id: i,
  entity: {
    site_id: i % 3,
    file_timestamp: new Date(Date.UTC(2021, i % 3, 10, i % 3, 0)).getTime() / 1000,
    clip_offset_in_file: 0,
    filename: `audio_${i % 3}.mp3`
  }
}));

const wrapper = ({ children }) => (
  <SitesProvider value="some context">{children}</SitesProvider>
);

describe('useFilteredResults', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({
      data: [
        { id: 1, name: 'Site A' },
        { id: 2, name: 'Site B' }
      ]
    }));
  });

  it('filters sites', () => {
    const { result } = renderHook(() => useFilteredResults(results), { wrapper });
    act(() => {
      result.current.setSelectedSites([1, 2]);
    });
    const { filteredResults } = result.current;
    const correctResults = filteredResults.every(r => [1, 2].includes(r.entity.site_id));
    expect(correctResults).toBeTruthy();
  });

  it('filters dates', () => {
    const { result } = renderHook(() => useFilteredResults(results), { wrapper });
    act(() => {
      const from = new Date(Date.UTC(2021, 2, 1));
      const to = new Date(Date.UTC(2021, 2, 28));
      result.current.setSelectedDates([from, to]);
    });
    const { filteredResults } = result.current;
    const correctResults = filteredResults.every(r => r.entity.file_timestamp === new Date(Date.UTC(2021, 2, 10, 2, 0)).getTime() / 1000);
    expect(correctResults).toBeTruthy();
  });

  it('filters times', () => {
    const { result } = renderHook(() => useFilteredResults(results), { wrapper });
    act(() => {
      result.current.setSelectedTimes([0, 1]);
    });
    const { filteredResults } = result.current;
    const correctResults = filteredResults.every(r => new Date(r.entity.file_timestamp * 1000).getUTCHours() <= 1);
    expect(correctResults).toBeTruthy();
  });

  it('filters top result per recording', () => {
    const { result } = renderHook(() => useFilteredResults(results), { wrapper });
    act(() => {
      result.current.topMatchPerRecordingProps.onChange({ target : { checked: true }});
    });
    const { filteredResults } = result.current;
    expect(filteredResults.length).toEqual(3);
  });
});
