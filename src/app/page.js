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
import Image from 'next/image';

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
      overflow="hidden"
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
        pt={[0, 0, '10rem']}
      >
        <Flex flexDirection={['column', 'column', null, 'row']}>
          <Heading
            fontWeight="light"
            textTransform="uppercase"
            color="primary.500"
            size="4xl"
            fontSize={['2.5rem', '4rem', '5rem']}
            ml={-0.5}
            letterSpacing="4px"
            position="relative"
          >
            A2O
            <Heading
              as="span"
              size="4xl"
              fontSize={['2.5rem', '4rem', '5rem']}
              color="primary.200"
              fontWeight="bold"
              letterSpacing="4px"
            >
              Search
            </Heading>
            <Box
              position="absolute"
              top={['-1rem', null, '-15rem']}
              left={['1rem', null, '-1rem']}
              height="clamp(350px, 40vw, 550px)"
              width="clamp(350px, 40vw, 550px)"
              borderRadius="50%"
              animation={`${ripple} 2s infinite linear`}
            />
          </Heading>
          <Container ml={[0, 0, 0, '6rem']} pl={[0, 1]} p={[0, 2]}>
            <Text mb={6} fontSize="lg">Run audio similarity search on the Australian Acoustic Observatory media archive. A2O Search uses Machine Learning models developed at Google to find similar audio recordings across space and time. It is intended to augment and enable bioacoustics research.</Text>
            <Button
              as={NextLink}
              variant="primary"
              href="/search"
            >
              Search
            </Button>
            <Box display="flex" alignItems="center" mt="10" gap="5">
              <Image src="/aao.svg" width="136" height="64" alt="Australian Acoustic Observatory" />
              <Image src="/google.svg" width="136" height="46" alt="Google" />
              <Image src="/qut.svg" width="64" height="64" alt="Queensland University of Technology" />
            </Box>
            <Box mt="5">
              <Image src="/developmentseed.svg" width="136" height="46" alt="Development Seed" />
            </Box>
          </Container>
        </Flex>
      </Container>
    </Box>
  );
}
