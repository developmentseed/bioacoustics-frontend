import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';

import TableView from './TableView';
import { formatDate } from '@/utils';

import { results } from './fixtures';

describe('TableView', () => {
  it('renders all results', () => {
    render(<TableView results={results} selectedResults={[]} toggleSelect={() => {}} />);
    const tableBody = screen.getByTestId('results-table');
    expect(within(tableBody).getAllByRole('row').length).toEqual(3);
  });

  it('renders result correctly', () => {
    render(<TableView results={results} selectedResults={[]} toggleSelect={() => {}} />);
    const tableBody = screen.getByTestId('results-table');
    const firstRow = within(tableBody).getAllByRole('row')[0];
    const cells = within(firstRow).getAllByRole('cell');
    expect(cells[2].textContent).toEqual(`${results[0].distance}`);
    expect(cells[3].textContent).toEqual(`${results[0].entity.site_name} (${results[0].entity.subsite_name})`);
    expect(cells[4].textContent).toEqual(formatDate(results[0].entity.file_timestamp));
  });
});
