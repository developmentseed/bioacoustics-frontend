import { renderHook, act } from '@testing-library/react';
import useDownload from './useDownload';

describe('useDownload', () => {
  it('toggles selected results', () => {
    const { result } = renderHook(() => useDownload());
    expect(result.current.selectedResults).toEqual([]);

    act(() => {
      result.current.toggleSelect(1);
    });
    expect(result.current.selectedResults).toEqual([1]);

    act(() => {
      result.current.toggleSelect(2);
    });
    expect(result.current.selectedResults).toEqual([1, 2]);

    act(() => {
      result.current.toggleSelect(1);
    });
    expect(result.current.selectedResults).toEqual([2]);
  });
});
