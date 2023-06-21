import { useRef, useState } from 'react';
import T from 'prop-types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { ACCEPTED_AUDIO_TYPES } from '@/settings';
import { Error } from '@/components';
import useUploadValidation from './hooks/useUploadValidation';

export default function AudioSelectForm({ handleFileSelect }) {
  const inputRef = useRef();
  const [ name, setName ] = useState();
  const { error, handleFileChange: validate } = useUploadValidation(handleFileSelect);

  const handleFileChange = async (e) => {
    setName(e.target.files[0].name);
    validate(e);
  };

  return (
    <Box bg="white" p="2" borderRadius="12" boxShadow="lg">
      <Box
        border="2px dashed"
        bg="blackAlpha.50"
        borderColor="primary.400"
        borderRadius="6"
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
          Maximum audio length 5 minutes. Maximum file size 1 Gb
        </Text>
        <input
          ref={inputRef}
          type="file"
          name="file"
          onChange={handleFileChange}
          aria-describedby="file-hint"
          style={{ display: 'none' }}
          accept={ACCEPTED_AUDIO_TYPES.join(',')}
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
          {name && <Text>{name}</Text>}
        </Flex>
        {error && <Error>{ error }</Error> }
      </Box>
    </Box>
  );
}

AudioSelectForm.propTypes = {
  handleFileSelect: T.func.isRequired
};
