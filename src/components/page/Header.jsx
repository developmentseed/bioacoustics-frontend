'use client';
import { Box, Container } from '@chakra-ui/react';

export default function Header () {
  return (
    <Box as="header" py="4" boxShadow="base">
      <Container>
        <Box>EcoEcho</Box>
      </Container>
    </Box>
  );
}
