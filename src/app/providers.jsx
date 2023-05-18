'use client';

import T from 'prop-types';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

export default function Providers({ children }) {
  return (
    <CacheProvider>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}

Providers.propTypes = {
  children: T.node.isRequired
};
