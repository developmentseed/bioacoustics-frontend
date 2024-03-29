import { render, screen } from '@testing-library/react';

import { TimeBox } from '.';

describe('TimeBox', () => {
  test('renders with undefined time', async () => {
    render(<TimeBox />);
    expect(await screen.findByText('00:00')).toBeInTheDocument();
  });

  test('renders seconds >= 10', async () => {
    render(<TimeBox time={19.356323} />);
    expect(await screen.findByText('00:19')).toBeInTheDocument();
  });

  test('renders seconds < 10', async () => {
    render(<TimeBox time={9.356323} />);
    expect(await screen.findByText('00:09')).toBeInTheDocument();
  });

  test('renders minutes < 10', async () => {
    render(<TimeBox time={61.211} />);
    expect(await screen.findByText('01:01')).toBeInTheDocument();
  });

  test('renders minutes > 10', async () => {
    render(<TimeBox time={601.211} />);
    expect(await screen.findByText('10:01')).toBeInTheDocument();
  });
});
