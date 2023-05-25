'use client';
import T from 'prop-types';
import { Box } from '@chakra-ui/react';

export default function InpageHeader({ children }) {
  return (
    <Box
      bgGradient="linear(to-br, rgba(226, 237, 105, 0.06), rgba(126, 196, 64, 0.06), rgba(3, 116, 71, 0.06))"
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
