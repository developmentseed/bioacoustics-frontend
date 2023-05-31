import { render, screen } from '@testing-library/react';

import Results from './';

describe('Results', () => {
  it('renders the loading spinner', () => {
    render(<Results isLoading={true} results={[]} />);
    expect(screen.queryByTestId('loading')).toBeInTheDocument();
  });

  it('renders the results table', () => {
    render(
      <Results
        isLoading={false}
        results={[{ id: 1, distance: 1.234, entity: { site_name: 'Site A', subsite_name: 'A.1', file_timestamp: 1620360000 }}]}
      />);
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-table')).toBeInTheDocument();
  });
});
