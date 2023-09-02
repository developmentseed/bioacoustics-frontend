'use client';
import dynamic from 'next/dynamic';
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';

import { Loading } from '@/components';
import { InpageHeader } from '@/components/page';
import { MAX_AUDIO_CLIP_LENGTH } from '@/settings';

import AudioSelectForm from './AudioSelectForm';
import useSearchForm from './hooks/useSearchForm';
import AudioResetForm from './AudioResetForm';

import { SitesProvider } from './context/sites';
const AudioClipper = dynamic(() => import('./AudioClipper'), {
  loading: () => <Loading size="md" />,
});
const Results = dynamic(() => import('./results'), {
  loading: () => <Loading size="md" />,
  ssr: false
});

export default function Upload() {
  const {
    isInitializing,
    duration,
    file,
    results,
    isSubmitting,
    submitButtonProps,
    setClip,
    clipStart,
    clipLength,
    handleFileSelect,
    error
  } = useSearchForm();

  if (isInitializing) {
    return <Loading size="md" />;
  }

  return (
    <SitesProvider>
      <Box as="main" minH="100%" display="flex" flexDirection="column">
        <InpageHeader>
          <Container maxW="container.xl" overflow="hidden">
            <Heading as="h1" size={['md', 'lg']} mb="2">
              Audio Similarity Search
            </Heading>
            {file && <AudioResetForm setFile={handleFileSelect} error={error} />}
            {!file && <Text fontSize="sm" mb="2">Upload audio to search for similar sounds</Text>}
            <form>
              {!file ? (
                <AudioSelectForm handleFileSelect={handleFileSelect} error={error} />
              ) : (
                <AudioClipper file={file} clipStart={clipStart} clipLength={clipLength} setClip={setClip} />
              )}

              {file && (duration <= MAX_AUDIO_CLIP_LENGTH || clipStart) && (
                <Box textAlign="right" mt="2" display="flex" flexDirection="column" alignItems={['stretch', 'end']}>
                  <Button
                    variant="primary"
                    type="submit"
                    {...submitButtonProps}
                  >
                    Search
                  </Button>
                </Box>
              )}
            </form>
          </Container>
        </InpageHeader>
        <Results results={results} isLoading={isSubmitting} file={file} />
      </Box>
    </SitesProvider>
  );
}
