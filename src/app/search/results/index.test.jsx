import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';

import { SitesProvider } from '../context/sites';
import { AppStateProvider } from '../context/appState';

import Results from './';
import { results } from './fixtures';

const wrapper = ({ children }) => (
  <SitesProvider>
    <AppStateProvider>
      {children}
    </AppStateProvider>
  </SitesProvider>
);

jest.mock('next/navigation', () => ({
  ...(jest.requireActual('next/navigation')),
  useSearchParams: () => ({
    get: () => undefined
  })
}));

describe('Results', () => {
  beforeEach(() => {
    window.scrollTo = () => {};
    fetch.resetMocks();
    fetch.mockIf('https://api.bioacoustics.ds.io/api/v1/capabilities/', () => (
      { public_storage: true }
    ));
    fetch.mockIf('https://api.bioacoustics.ds.io/api/v1/sites', () => ({
      data: [
        { id: 1, name: 'Site A' },
        { id: 2, name: 'Site B' }
      ]
    }));
    window.URL.createObjectURL = () => 'https://localhost/123-456';
  });

  it('renders the loading spinner', () => {
    render(<Results isLoading={true} results={[]} />, { wrapper });

    expect(screen.queryByTestId('loading')).toBeInTheDocument();
  });

  it('renders the small results grid', async () => {
    render(<Results isLoading={false} results={results} />, { wrapper });

    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).toBeInTheDocument();
  });

  it('renders the large results grid', async () => {
    render(<Results isLoading={false} results={results} />, { wrapper });

    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).toBeInTheDocument();

    userEvent.click(screen.getByLabelText('View results in large grid'));
    expect(await screen.findByTestId('results-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
  });

  it('renders the results table', async () => {
    render(<Results isLoading={false} results={results} />, { wrapper });

    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText('View results in table'));
    expect(await screen.findByTestId('results-table')).toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).not.toBeInTheDocument();
  });
});
