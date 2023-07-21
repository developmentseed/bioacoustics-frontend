'use client';

import T from 'prop-types';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

import NextAdapterApp from 'next-query-params/app';
import { QueryParamProvider } from 'use-query-params';

import theme from './theme';

export default function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <QueryParamProvider adapter={NextAdapterApp}>
          {children}
        </QueryParamProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}

Providers.propTypes = {
  children: T.node.isRequired
};
