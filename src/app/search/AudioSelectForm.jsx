import { useRef } from 'react';
import T from 'prop-types';
import { Box, Button, Text } from '@chakra-ui/react';

export default function AudioSelectForm({ handleFileSelect }) {
  const inputRef = useRef();

  return (
    <Box>
      <Text>Upload audio to search for similar sounds</Text>
      <Box
        as="form"
        border="2px dashed"
        borderColor="primary.400"
        borderRadius="5"
        textAlign="center"
        p="5"
        mt="1"
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
    </Box>
  );
}

AudioSelectForm.propTypes = {
  handleFileSelect: T.func.isRequired
};
