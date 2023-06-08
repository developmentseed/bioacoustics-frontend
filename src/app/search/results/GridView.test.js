import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';

import GridView from './GridView';
import { formatDate } from '@/utils';

const results = [
  { id: 1, distance: 1.234, entity: { site_name: 'Site A', subsite_name: 'A.1', file_timestamp: 1620360000 } },
  { id: 2, distance: 2.345, entity: { site_name: 'Site A', subsite_name: 'A.2', file_timestamp: 1594958400 } },
  { id: 3, distance: 3.456, entity: { site_name: 'Site B', subsite_name: 'B.1', file_timestamp: 1604109600 } }
];

describe('GridView', () => {
  it('renders all results', () => {
    render(<GridView results={results} />);
    expect(screen.getAllByTestId('result-card').length).toEqual(3);
  });

  it('renders small results card', () => {
    render(<GridView results={results} />);
    const card = screen.getAllByTestId('result-card')[0];
    expect(within(card).queryByText(results[0].id)).toBeInTheDocument();
    expect(within(card).queryByText(results[0].entity.site_name)).not.toBeInTheDocument();
    expect(within(card).queryByText(formatDate(results[0].entity.file_timestamp))).not.toBeInTheDocument();
  });

  it('renders large results card', () => {
    render(<GridView results={results} large={true} />);
    const card = screen.getAllByTestId('result-card')[0];
    expect(within(card).queryByText(results[0].id)).toBeInTheDocument();
    expect(within(card).queryByText(results[0].entity.site_name)).toBeInTheDocument();
    expect(within(card).queryByText(formatDate(results[0].entity.file_timestamp))).toBeInTheDocument();
  });
});
