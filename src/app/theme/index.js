import { extendTheme } from '@chakra-ui/react';
import { Lexend } from '@next/font/google';

import Button from './Button';
import Heading from './Heading';

const lexend = Lexend({ subsets: ['latin'], display: 'swap' });

export default extendTheme({
  colors: {
    primary: {
      100: '#E2ED69',
      200: '#7EC440',
      300: '#119934',
      400: '#037447',
      500: '#013A38'
    },
    neutral: {
      100: '#E6E6E6',
      200: '#9C9C9c',
      300: '#828282',
      400: '#555555',
      500: '#1E1E1E'
    },
  },
  fonts: {
    heading: lexend.style.fontFamily,
    body: lexend.style.fontFamily,
  },
  styles: {
    global: {
      // styles for the `body`
      body: {
        color: 'neutral.400',
      },
    },
  },
  components: {
    Button,
    Heading
  },
});
