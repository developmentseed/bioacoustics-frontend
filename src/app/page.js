'use client';
import {
  Container,
  Box,
  Heading,
  keyframes,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';
import NextLink from 'next/link';

const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(6, 188, 115, 0.1),
                0 0 0rem 2rem rgba(6, 188, 115, 0.1),
                0 0 0rem 4rem rgba(6, 188, 115, 0.1),
                0 0 1rem 6rem rgba(6, 188, 115, 0.1);
  }
  100% {
    box-shadow: 0 0 0rem 2rem rgba(6, 188, 115, 0.1),
                0 0 0rem 4rem rgba(6, 188, 115, 0.1),
                0 0 1rem 6rem rgba(6, 188, 115, 0.1),
                0 0 2rem 8rem rgba(6, 188, 115, 0);
  }
`;

export default function Home() {
  return (
    <Box
      as="main"
      height="calc(100vh - 3.625rem)"
      bg="whiteAlpha.200"
      position="relative"
      borderBottom="8px solid"
      borderColor="primary.400"
      zIndex={10}
      _after={{
        position: 'absolute',
        content: '" "',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: -1,
        opacity: '25%',
        bgGradient:
          'radial(100% 100% at 0% 0%, primary.100 0%, primary.200 42%, primary.400 100%)',
      }}
    >
      <Container
        position="relative"
        maxW="container.xl"
        height="100%"
        display="flex"
        flexDir="column"
        justifyContent="center"
      >
        <Flex flexDirection={['column', 'column', 'row']}>
          <Heading
            fontWeight="light"
            textTransform="uppercase"
            color="primary.500"
            size="4xl"
            fontSize={['2rem', '5rem', '6rem']}
            letterSpacing="4px"
          >
            Eco
            <Heading
              as="span"
              size="4xl"
              fontSize={['2rem', '5rem', '6rem']}
              color="primary.200"
              fontWeight="bold"
              letterSpacing="4px"
            >
              Echo
            </Heading>
          </Heading>
          <Container ml={[null, null, '25%']}>
            <Text mb={6} fontSize="lg">Run audio similarity search on the archive</Text>
            <Button
              as={NextLink}
              variation="solid"
              colorScheme="primary"
              href="/search"
            >
              Search
            </Button>
          </Container>
        </Flex>
        <Box
          position="absolute"
          left="-5%"
          height="clamp(350px, 40vw, 600px)"
          width="clamp(350px, 40vw, 600px)"
          borderRadius="50%"
          animation={`${ripple} 2s infinite linear`}
        />
      </Container>
    </Box>
  );
}
