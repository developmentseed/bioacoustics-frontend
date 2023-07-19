import { useRef, useState, useEffect } from 'react';
import T from 'prop-types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { Error } from '@/components';
import AudioRecorder from './AudioRecorder';
import { Link } from '@chakra-ui/react';

export default function AudioSelectForm({ error, handleFileSelect }) {
  const inputRef = useRef();
  const dropZoneRef = useRef();
  const [ dragOver, setDragOver ] = useState(false);

  const handleFileChange = async (e) => handleFileSelect(e.target.files);

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    const handleDragOver = (e) => {
      e.preventDefault();
      setDragOver(true);
    };
    const handleDragLeave = (e) => {
      e.preventDefault();
      setDragOver(false);
    };
    const handleDrop = (e) => {
      e.preventDefault();
      setDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    };

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, [handleFileSelect]);

  return (
    <Box bg="white" p="2" borderRadius="12" boxShadow="lg">
      <Box
        border="2px dashed"
        bg={dragOver ? 'green.50' : 'blackAlpha.50'}
        borderColor={dragOver ? 'primary.400' : 'neutral.300'}
        borderRadius="6"
        textAlign="center"
        p="5"
        mt="1"
        ref={dropZoneRef}
        id="dropzone"
      >
        <Text>Click to select from your device</Text>
        <Text
          id="file-hint"
          color="neutral.300"
          mb="3"
          fontSize="sm"
        >
          Maximum audio length 5 minutes. Maximum file size 1 Gb
        </Text>
        <input
          ref={inputRef}
          type="file"
          name="file"
          onChange={handleFileChange}
          aria-describedby="file-hint"
          style={{ display: 'none' }}
        />
        <Flex gap="2" justifyContent="center" alignItems={['center', null, 'baseline']} flexDirection={['column', null, 'row']}>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => inputRef.current.click()}
          >
            Select File
          </Button>
          <AudioRecorder setFile={handleFileSelect} />
        </Flex>
        <Box mt="2" fontSize="sm"><Link href="/random" textDecoration="underline">I&apos;m feeling lucky</Link></Box>
        {error && <Error>{ error }</Error> }
      </Box>
    </Box>
  );
}

AudioSelectForm.propTypes = {
  error: T.node,
  handleFileSelect: T.func.isRequired
};
