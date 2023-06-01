import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';

import TableView from './TableView';
import { formatDate } from '@/utils';

const results = [
  { id: 1, distance: 1.234, entity: { site_name: 'Site A', subsite_name: 'A.1', file_timestamp: 1620360000 } },
  { id: 2, distance: 2.345, entity: { site_name: 'Site A', subsite_name: 'A.2', file_timestamp: 1594958400 } },
  { id: 3, distance: 3.456, entity: { site_name: 'Site B', subsite_name: 'B.1', file_timestamp: 1604109600 } }
];

describe('TableView', () => {
  it('renders all results', () => {
    render(<TableView results={results} />);
    const tableBody = screen.getByTestId('results-table');
    expect(within(tableBody).getAllByRole('row').length).toEqual(3);
  });

  it('renders result correctly', () => {
    render(<TableView results={results} />);
    const tableBody = screen.getByTestId('results-table');
    const firstRow = within(tableBody).getAllByRole('row')[0];
    const cells = within(firstRow).getAllByRole('cell');
    expect(cells[0].textContent).toEqual(`${results[0].id}`);
    expect(cells[1].textContent).toEqual(`${results[0].distance}`);
    expect(cells[2].textContent).toEqual(results[0].entity.site_name);
    expect(cells[3].textContent).toEqual(results[0].entity.subsite_name);
    expect(cells[4].textContent).toEqual(formatDate(results[0].entity.file_timestamp));
  });
});
