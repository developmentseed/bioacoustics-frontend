import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';

import GridView from './GridView';
import { formatDate } from '@/utils';

import { results } from './fixtures';

describe('GridView', () => {
  it.only('renders all results', () => {
    render(<GridView results={results} />);
    expect(screen.getAllByTestId('result-card').length).toEqual(3);
  });

  it('renders small results card', () => {
    render(<GridView results={results} />);
    const card = screen.getAllByTestId('result-card')[0];
    expect(within(card).queryByText(results[0].entity.filename.split('/')[1])).toBeInTheDocument();
    expect(within(card).queryByText(`${results[0].entity.site_name} (${results[0].entity.subsite_name})`)).not.toBeInTheDocument();
    expect(within(card).queryByText(formatDate(results[0].entity.file_timestamp))).not.toBeInTheDocument();
    expect(within(card).queryByText(
      formatDate(results[0].entity.file_timestamp + results[0].entity.clip_offset_in_file)
    )).not.toBeInTheDocument();
  });

  it('renders large results card', () => {
    render(<GridView results={results} large={true} />);
    const card = screen.getAllByTestId('result-card')[0];
    expect(within(card).queryByText(results[0].entity.filename.split('/')[1])).toBeInTheDocument();
    expect(within(card).queryByText(`${results[0].entity.site_name} (${results[0].entity.subsite_name})`)).toBeInTheDocument();
    expect(within(card).queryByText(formatDate(results[0].entity.file_timestamp))).toBeInTheDocument();
    expect(within(card).queryByText(
      formatDate(results[0].entity.file_timestamp + results[0].entity.clip_offset_in_file)
    )).toBeInTheDocument();
  });
});
