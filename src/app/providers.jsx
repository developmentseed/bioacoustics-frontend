'use client';

import T from 'prop-types';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

// import NextAdapterApp from 'next-query-params/app';
import { QueryParamProvider } from 'use-query-params';

import theme from './theme';


import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useMemo} from 'react';

function NextAdapterApp({children}) {
  // This is adopted from next-query-params (https://github.com/amannn/next-query-params/blob/main/packages/next-query-params/src/NextAdapterApp.tsx)
  // to prevent scrolling when the URL query parameters are updated.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const adapter = useMemo(() => {
    function getUrl(location) {
      let url = pathname;
      if (location.search) {
        url += location.search;
      }
      if (window.location.hash) {
        url += window.location.hash;
      }

      return url;
    }

    return {
      replace(location) {
        router.replace(getUrl(location));
      },
      push(location) {
        router.push(getUrl(location), { scroll: false });
      },
      location: {
        search: searchParams.toString()
      }
    };
  }, [searchParams, pathname, router]);

  return children(adapter);
}

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
