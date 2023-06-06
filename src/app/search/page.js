'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Container, Heading } from '@chakra-ui/react';

import { Loading } from '@/components';
import { InpageHeader } from '@/components/page';
import AudioSelectForm from './AudioSelectForm';
import useSearchForm from './hooks/useSearchForm';
import Results from './results';
const AudioClipper = dynamic(() => import('./AudioClipper'), {
  loading: () => <Loading size="xl" />,
});

export default function Upload() {
  const [clipStart, setClipStart] = useState(); // eslint-disable-line
  const [clipLength, setClipLength] = useState(); // eslint-disable-line
  const {
    file,
    results,
    isSubmitting,
    handleFileSelect,
    handleFormSubmit
  } = useSearchForm();

  const setClip = (start, length) => {
    setClipStart(start);
    setClipLength(length);
  };

  return (
    <main>
      <InpageHeader>
        <Container maxW="container.xl">
          <Box bg="white" p="5" borderRadius="5" boxShadow="lg" as="form">
            <Heading as="h1" size="md" mb="2">
              Search
            </Heading>
            {!file ? (
              <AudioSelectForm handleFileSelect={handleFileSelect} />
            ) : (
              <AudioClipper file={file} setClip={setClip} />
            )}
            <Box textAlign="right" mt="2">
              <Button
                variant="primary"
                type="submit"
                onClick={handleFormSubmit}
                isDisabled={isSubmitting}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Container>
      </InpageHeader>
      <Results results={results} isLoading={isSubmitting} />
    </main>
  );
}
