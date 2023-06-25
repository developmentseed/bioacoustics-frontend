import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Results from './';
import { results } from './fixtures';

describe('Results', () => {
  beforeEach(() => {
    window.scrollTo = () => {};
    window.URL.createObjectURL = () => 'https://localhost/123-456';
  });

  it('renders the loading spinner', () => {
    render(<Results isLoading={true} results={[]} />);
    expect(screen.queryByTestId('loading')).toBeInTheDocument();
  });

  it('renders the small results grid', async () => {
    render(
      <Results
        isLoading={false}
        results={results}
      />);
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).toBeInTheDocument();
  });

  it('renders the large results grid', async () => {
    render(
      <Results
        isLoading={false}
        results={results}
      />);
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).toBeInTheDocument();

    userEvent.click(screen.getByLabelText('View results in large grid'));
    expect(await screen.findByTestId('results-grid')).toBeInTheDocument();
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();
  });

  it('renders the results table', async () => {
    render(
      <Results
        isLoading={false}
        results={results}
      />);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-table')).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText('View results in table'));
    expect(await screen.findByTestId('results-table')).toBeInTheDocument();
    expect(screen.queryByTestId('results-grid')).not.toBeInTheDocument();
  });
});
