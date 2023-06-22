import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetch from 'jest-fetch-mock';

import { SitesProvider } from '../context/sites';
import Results from './';
import { results } from './fixtures';

describe('Results', () => {
  beforeEach(() => {
    window.scrollTo = () => {};
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({
      data: [
        { id: 1, name: 'Site A' },
        { id: 2, name: 'Site B'} 
      ]
    }));
  });

  it('renders the loading spinner', () => {
    render(
      <SitesProvider>
        <Results isLoading={true} results={[]} />
      </SitesProvider>
    );
    expect(screen.queryByTestId('loading')).toBeInTheDocument();
  });

  it('renders the small results grid', async () => {
    render(
      <SitesProvider>
        <Results
          isLoading={false}
          results={results}
        />
      </SitesProvider>
    );
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).toBeInTheDocument();
  });

  it('renders the large results grid', async () => {
    render(
      <SitesProvider>
        <Results
          isLoading={false}
          results={results}
        />
      </SitesProvider>
    );
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).toBeInTheDocument();

    userEvent.click(screen.getByLabelText('View results in large grid'));
    expect(await screen.findByTestId('results-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
  });

  it('renders the results table', async () => {
    render(
      <SitesProvider>
        <Results
          isLoading={false}
          results={results}
        />
      </SitesProvider>
    );
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText('View results in table'));
    expect(await screen.findByTestId('results-table')).toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).not.toBeInTheDocument();
  });
});
