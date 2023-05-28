'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

import { Loading } from '@/components';
import { InpageHeader } from '@/components/page';
import AudioSelectForm from './AudioSelectForm';
const AudioClipper = dynamic(() => import('./AudioClipper'), {
  loading: () => <Loading size="xl" />,
});

export default function Upload() {
  const [file, setFile] = useState();
  const [results] = useState([]);

  const handleFileSelect = (e) => setFile(e.target.files[0]);

  return (
    <main>
      <InpageHeader>
        <Container maxW="container.xl">
          <Box bg="white" p="5" borderRadius="5" boxShadow="lg">
            <Heading as="h1" size="md" mb="2">
              Search
            </Heading>
            {!file ? (
              <AudioSelectForm handleFileSelect={handleFileSelect} />
            ) : (
              <AudioClipper file={file} />
            )}
          </Box>
        </Container>
      </InpageHeader>
      <Container mt="10">
        {results.length > 0 ? (
          <p>TODO: Showing some results here.</p>
        ) : (
          <Box textAlign="center">
            <Heading as="h2" size="base">
              Results
            </Heading>
            <Text>Upload audio to view results</Text>
          </Box>
        )}
      </Container>
    </main>
  );
}
