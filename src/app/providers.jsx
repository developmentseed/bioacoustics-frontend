'use client';

import T from 'prop-types';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

import { AppStateProvider } from './search/context/appState';

import theme from './theme';

export default function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <AppStateProvider>
          {children}
        </AppStateProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}

Providers.propTypes = {
  children: T.node.isRequired
};
