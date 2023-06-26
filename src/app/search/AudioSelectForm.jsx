import { useCallback } from 'react';
import T from 'prop-types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';

import { ACCEPTED_FILE_TYPES } from '@/settings';
import { Error } from '@/components';
import useUploadValidation from './hooks/useUploadValidation';

export default function AudioSelectForm({ handleFileSelect }) {
  const { error, validator: uploadValidator } = useUploadValidation();

  // CUSTOM FUNCTIONS FOR DROPZONE //
  const onDrop = useCallback(async (files) => {
    await handleFileSelect(files[0]);
  }, [handleFileSelect]);

  // DROPZONE DEFS //
  const { getRootProps, getInputProps, inputRef, isDragActive, acceptedFiles, fileRejections } =
    useDropzone({
      accept: ACCEPTED_FILE_TYPES,
      // validator: uploadValidator,
      maxFiles: 1,
      multiple: false,
      onDrop
    });
    // console.log(acceptedFiles, fileRejections);

  return (
    <Box bg="white" p="2" borderRadius="12" boxShadow="lg">
      <Box
        border="2px dashed"
        bg={isDragActive ? 'green.50' : 'blackAlpha.50'}
        borderColor={isDragActive ? 'primary.400' : 'neutral.300'}
        borderRadius="6"
        textAlign="center"
        p="5"
        mt="1"
        {...getRootProps()}
      >
        <Text>Click to select from your device</Text>
        <Text id="file-hint" color="neutral.300" mb="3" fontSize="sm">
          Maximum audio length 5 minutes. Maximum file size 1 Gb
        </Text>
        <input
          ref={inputRef}
          type="file"
          name="file"
          aria-describedby="file-hint"
          style={{ display: 'none' }}
          {...getInputProps()}
        />
        <Flex
          gap="2"
          justifyContent="center"
          alignItems={['center', null, 'baseline']}
          flexDirection={['column', null, 'row']}
        >
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => inputRef.current.click()}
          >
            Select File
          </Button>
        </Flex>
        {error && <Error>{error}</Error>}
      </Box>
    </Box>
  );
}

AudioSelectForm.propTypes = {
  handleFileSelect: T.func.isRequired,
};
