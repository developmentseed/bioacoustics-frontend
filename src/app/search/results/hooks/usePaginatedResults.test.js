import { renderHook, act } from '@testing-library/react';
import usePaginatedResults from './usePaginatedResults';

const results = Array(72).fill(0).map(Number.call, Number);

describe('usePaginatedResults', () => {
  it('renders first page', () => {
    const {result} = renderHook(() => usePaginatedResults(results));
    const { resultPage, previousPageProps, nextPageProps } = result.current;
    expect(resultPage.length).toEqual(25);
    expect(resultPage[0]).toEqual(0);
    expect(resultPage[24]).toEqual(24);
    expect(previousPageProps.isDisabled).toBeTruthy();
    expect(nextPageProps.isDisabled).toBeFalsy();
  });

  it('renders middle page', async () => {
    const { result } = renderHook(() => usePaginatedResults(results));
    act(() => {
      result.current.nextPageProps.onClick();
    });

    const { page, resultPage, previousPageProps, nextPageProps } = result.current;
    expect(page).toEqual(2);
    expect(resultPage.length).toEqual(25);
    expect(resultPage[0]).toEqual(25);
    expect(resultPage[24]).toEqual(49);
    expect(previousPageProps.isDisabled).toBeFalsy();
    expect(nextPageProps.isDisabled).toBeFalsy();

    act(() => {
      result.current.previousPageProps.onClick();
    });

    expect(result.current.page).toEqual(1);
  });

  it('renders last page', () => {
    const { result } = renderHook(() => usePaginatedResults(results));
    act(() => {
      result.current.nextPageProps.onClick();
    });
    expect(result.current.page).toEqual(2);
    act(() => {
      result.current.nextPageProps.onClick();
    });

    const { page, resultPage, previousPageProps, nextPageProps } = result.current;
    expect(page).toEqual(3);
    expect(resultPage.length).toEqual(22);
    expect(resultPage[0]).toEqual(50);
    expect(resultPage[21]).toEqual(71);
    expect(previousPageProps.isDisabled).toBeFalsy();
    expect(nextPageProps.isDisabled).toBeTruthy();

    act(() => {
      result.current.previousPageProps.onClick();
    });

    expect(result.current.page).toEqual(2);
  });
});
