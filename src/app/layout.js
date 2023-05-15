'use client';
import CssBaseline from '@mui/material/CssBaseline';

import { metadata } from './settings';

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en">
        <head>
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
        </head>
        <CssBaseline />
        <body>
          {children}
        </body>
      </html>
    </>
  );
}
