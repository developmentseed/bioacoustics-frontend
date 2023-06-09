'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';

import { Loading } from '@/components';
import { InpageHeader } from '@/components/page';
import { MAX_AUDIO_CLIP_LENGTH } from '@/settings';
import getDuration from '@/utils/getDuration';

import AudioSelectForm from './AudioSelectForm';
import useSearchForm from './hooks/useSearchForm';
import Results from './results';
const AudioClipper = dynamic(() => import('./AudioClipper'), {
  loading: () => <Loading size="xl" />,
});

export default function Upload() {
  const [clipStart, setClipStart] = useState();
  const [clipLength, setClipLength] = useState(); // eslint-disable-line
  const [duration, setDuration] = useState();

  const { file, setFile, results, isSubmitting, handleFormSubmit } =
    useSearchForm();

  const setClip = (start, length) => {
    setClipStart(start);
    setClipLength(length);
  };

  useEffect(() => {
    if (file) {
      getDuration(file).then(setDuration);
    } else {
      setDuration();
    }
  }, [file]);

  return (
    <Box as="main" minH="100%" display="flex" flexDirection="column">
      <InpageHeader>
        <Container maxW="container.xl">
          <Heading as="h1" size="md" mb="2">
            Audio Similarity Search
          </Heading>
          {!file && <Text fontSize="sm" mb="2">Upload audio to search for similar sounds</Text>}
          <form>
            {!file ? (
              <AudioSelectForm handleFileSelect={setFile} />
            ) : (
              <AudioClipper file={file} setClip={setClip} />
            )}
            {file && (duration <= MAX_AUDIO_CLIP_LENGTH || clipStart) && (
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
            )}
          </form>
        </Container>
      </InpageHeader>
      <Results results={results} isLoading={isSubmitting} />
    </Box>
  );
}
