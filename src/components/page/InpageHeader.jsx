'use client';
import T from 'prop-types';
import { Box } from '@chakra-ui/react';

export default function InpageHeader({ children }) {
  return (
    <Box
      py="5"
      borderBottom="4px solid"
      borderColor="primary.300"
    >
      {children}
    </Box>
  );
}

InpageHeader.propTypes = {
  children: T.node.isRequired,
};
