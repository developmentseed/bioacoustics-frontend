'use client';
import { useRef, useState } from 'react';
import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';

import SpectrogramPlayer from '@/components/audio/SpectrogramPlayer';
import { InpageHeader } from '@/components/page';

export default function Upload() {
  const [ file, setFile ] = useState();
  const [ results ] = useState([]);
  const inputRef = useRef();

  const handleFileSelect = (e) => setFile(e.target.files[0]);

  return (
    <main>
      <InpageHeader>
        <Heading as="h1" size="md">
          Search
        </Heading>
        <p>Upload audio to search for similar sounds</p>
        {!file ? (
          <Box
            as="form"
            border="2px dashed"
            borderColor="primary.400"
            borderRadius="5"
            textAlign="center"
            mt="5"
            p="5"
          >
            <Text>Click to select from your device</Text>
            <Text
              id="file-hint"
              color="neutral.300"
              mb="3"
              fontSize="sm"
            >
              Maximum audio length 10 minutes. Maximum file size 1 Gb
            </Text>
            <input
              ref={inputRef}
              type="file"
              name="file"
              onChange={handleFileSelect}
              aria-describedby="file-hint"
              style={{ display: 'none' }}
            />
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => inputRef.current.click()}
            >
              Select File
            </Button>
          </Box>
        ) : (
          <SpectrogramPlayer file={file} clippable />
        )}
      </InpageHeader>
      <Container mt="10">
        {results.length > 0 ? (
          <p>TODO: Showing some results here.</p>
        ) : (
          <Box textAlign="center">
            <Heading as="h2" size="base">Results</Heading>
            <Text>Upload audio to view results</Text>
          </Box>
        )}
      </Container>
    </main>
  );
}
