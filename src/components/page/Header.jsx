'use client';
import { Box, Container, HStack, Text } from '@chakra-ui/react';
import NavItem from './NavItem';
import NextLink from 'next/link';

export default function Header() {
  return (
    <Box as="header" py="4" boxShadow="base" zIndex={100} position="relative">
      <Container
        maxW="container.xl"
        display="flex"
        alignItems="baseline"
        justifyContent="space-between"
      >
        <Text
          fontSize="lg"
          fontWeight="light"
          textTransform="uppercase"
          color="primary.500"
          as={NextLink}
          letterSpacing="1px"
          href="/"
          _hover={{
            opacity: 0.8,
            transition: 'all 0.24s ease',
          }}
        >
          Eco
          <Text as="span" color="primary.200" fontWeight="bold">
            Echo
          </Text>
        </Text>
        <Box as="nav">
          <HStack as="ul" listStyleType="none" fontSize="sm" fontWeight="bold">
            <NavItem href="/search">Search</NavItem>
            <NavItem href="/about">About</NavItem>
          </HStack>
        </Box>
      </Container>
    </Box>
  );
}
