import { useRef, useState } from 'react';
import T from 'prop-types';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { ACCEPTED_AUDIO_TYPES, MAX_AUDIO_LENGTH, MAX_AUDIO_SIZE } from '@/settings';
import { Error } from '@/components';
import getDuration from '@/utils/getDuration';

export default function AudioSelectForm({ handleFileSelect }) {
  const inputRef = useRef();
  const [ error, setError ] = useState();
  const [ name, setName ] = useState();

  const validate = async (file) => {
    const duration = await getDuration(file);
    const errors = [];
    if (duration > MAX_AUDIO_LENGTH) {
      errors.push('The audio length exceeds the limit of 5 minutes. Upload a shorter recording.');
    }
    if (file.size > MAX_AUDIO_SIZE) {
      errors.push('The file size exceeds the limit of 1GB. Upload a smaller file.');
    }
    return errors;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setName(file.name);

    const errors = await validate(file);
    if (errors.length > 0) {
      setError(errors.join(' '));
    } else {
      handleFileSelect(file);
    }

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
