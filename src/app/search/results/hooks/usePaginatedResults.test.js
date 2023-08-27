import { renderHook, act } from '@testing-library/react';
import usePaginatedResults from './usePaginatedResults';

import { AppStateProvider } from '../../context/appState';

const results = Array(72).fill(0).map((_, i) => ({
  id: i,
  entity: {
    site_id: i % 3,
    file_timestamp: new Date(Date.UTC(2021, i % 3, 10, i % 3, 0)).getTime() / 1000,
    clip_offset_in_file: 0,
    filename: `audio_${i % 3}.mp3`
  }
}));

jest.mock('next/navigation', () => ({
  ...(jest.requireActual('next/navigation')),
  useSearchParams: () => ({
    get: () => undefined
  })
}));


const wrapper = ({ children }) => (
  <AppStateProvider>
    {children}
  </AppStateProvider>
);

describe('usePaginatedResults', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({
      data: [
        { id: 1, name: 'Site A' },
        { id: 2, name: 'Site B' }
      ]
    }));
  });

  it('renders first page', () => {
    const {result} = renderHook(() => usePaginatedResults(results), { wrapper });
    const { resultPage, previousPageProps, firstPageProps, nextPageProps, lastPageProps } = result.current;
    expect(resultPage.length).toEqual(24);
    expect(resultPage[0].id).toEqual(0);
    expect(resultPage[24].id).toEqual(24);
    expect(previousPageProps.isDisabled).toBeTruthy();
    expect(firstPageProps.isDisabled).toBeTruthy();
    expect(nextPageProps.isDisabled).toBeFalsy();
    expect(lastPageProps.isDisabled).toBeFalsy();
  });

  it('renders middle page', async () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    act(() => {
      result.current.nextPageProps.onClick();
    });

    const { page, resultPage, previousPageProps, firstPageProps, nextPageProps, lastPageProps } = result.current;
    expect(page).toEqual(2);
    expect(resultPage.length).toEqual(24);
    expect(resultPage[0].id).toEqual(25);
    expect(resultPage[24].id).toEqual(49);
    expect(previousPageProps.isDisabled).toBeFalsy();
    expect(firstPageProps.isDisabled).toBeFalsy();
    expect(nextPageProps.isDisabled).toBeFalsy();
    expect(lastPageProps.isDisabled).toBeFalsy();

    act(() => {
      result.current.previousPageProps.onClick();
    });

    expect(result.current.page).toEqual(1);
  });

  it('renders last page', () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    act(() => {
      result.current.nextPageProps.onClick();
    });
    expect(result.current.page).toEqual(2);
    act(() => {
      result.current.nextPageProps.onClick();
    });

    const { page, resultPage, previousPageProps, firstPageProps, nextPageProps, lastPageProps } = result.current;
    expect(page).toEqual(3);
    expect(resultPage.length).toEqual(22);
    expect(resultPage[0].id).toEqual(50);
    expect(resultPage[21].id).toEqual(71);
    expect(previousPageProps.isDisabled).toBeFalsy();
    expect(firstPageProps.isDisabled).toBeFalsy();
    expect(nextPageProps.isDisabled).toBeTruthy();
    expect(lastPageProps.isDisabled).toBeTruthy();

    act(() => {
      result.current.previousPageProps.onClick();
    });

    expect(result.current.page).toEqual(2);
  });

  it('jumps to first page', () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    act(() => {
      result.current.nextPageProps.onClick();
    });

    expect(result.current.page).toEqual(2);
    act(() => {
      result.current.firstPageProps.onClick();
    });
    expect(result.current.page).toEqual(1);
  });

  it('jumps to last page', () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });

    expect(result.current.page).toEqual(1);
    act(() => {
      result.current.lastPageProps.onClick();
    });
    expect(result.current.page).toEqual(3);
  });

  it('disables pagination buttons when there are no matches', () => {
    const { result } = renderHook(() => usePaginatedResults([]), { wrapper });
    const { resultPage, previousPageProps, nextPageProps } = result.current;
    expect(resultPage.length).toEqual(0);
    expect(previousPageProps.isDisabled).toBeTruthy();
    expect(nextPageProps.isDisabled).toBeTruthy();
  });

  it('resets page when the filters are changed', () => {
    const { result, rerender } = renderHook(
      (r) => usePaginatedResults(r),
      { initialProps: results, wrapper }
    );
    act(() => {
      result.current.nextPageProps.onClick();
    });
    expect(result.current.page).toEqual(2);

    rerender([{
      id: 1,
      entity: {
        site_id: 1,
        file_timestamp: new Date(Date.UTC(2021, 1, 10, 1, 0)).getTime() / 1000,
        clip_offset_in_file: 0,
        filename: 'audio_1.mp3'
      }
    }]);
    expect(result.current.page).toEqual(1);
  });

  it('sets value on ENTER', async () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.pageInputProps.onChange(2);
    });
    expect(result.current.pageInputProps.value).toEqual(2);
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.pageInputProps.onKeyUp({ code: 'Enter', target: { value: 2 }});
    });

    expect(result.current.pageInputProps.value).toEqual(2);
    expect(result.current.page).toEqual(2);
  });

  it('does not set value on invalid page (> numpages)', async () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.pageInputProps.onChange(5);
    });
    expect(result.current.pageInputProps.value).toEqual(5);
    expect(result.current.pageInputProps.isInvalid).toEqual(true);
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.pageInputProps.onKeyUp({ code: 'Enter', target: { value: 5 }});
    });

    expect(result.current.page).toEqual(1);
  });

  it('does not set value on invalid page (< 1)', async () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.pageInputProps.onChange(0);
    });
    expect(result.current.pageInputProps.value).toEqual(0);
    expect(result.current.pageInputProps.isInvalid).toEqual(true);
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.pageInputProps.onKeyUp({ code: 'Enter', target: { value: 0 }});
    });

    expect(result.current.page).toEqual(1);
  });

  it('reset page input on blur', async () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.pageInputProps.onChange(2);
    });
    expect(result.current.pageInputProps.value).toEqual(2);

    act(() => {
      result.current.pageInputProps.onBlur();
    });

    expect(result.current.pageInputProps.value).toEqual(1);
  });

  it('updates the input value on page change', () => {
    const { result } = renderHook(() => usePaginatedResults(results), { wrapper });
    expect(result.current.page).toEqual(1);

    act(() => {
      result.current.nextPageProps.onClick();
    });
    expect(result.current.page).toEqual(2);
    expect(result.current.pageInputProps.value).toEqual(2);
  });
});
