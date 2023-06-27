import T from 'prop-types';
import Providers from './providers';
import { Header } from '@/components/page';

export const metadata = {
  title: 'EcoEcho',
  description: 'Run audio similarity search on the Australian Acoustic Observatory media archive',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%' }}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: T.node
};
