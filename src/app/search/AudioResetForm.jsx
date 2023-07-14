import T from 'prop-types';

import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader
} from '@chakra-ui/react';
import { MdChevronLeft } from 'react-icons/md';

import { ACCEPTED_AUDIO_TYPES } from '@/settings';
import { Error } from '@/components';

export default function AudioResetForm({ error, setFile }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleReset = () => {
    onClose();
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'file');
    inputEl.setAttribute('accept', ACCEPTED_AUDIO_TYPES.join(','));
    inputEl.addEventListener('change', setFile);
    inputEl.click();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>Select new audio</ModalHeader>
          <ModalBody>
            Are you sure you want to remove the current audio upload?
          </ModalBody>

          <ModalFooter>
            <Button mr="2" variant="ghost" onClick={onClose}>Keep current audio</Button>
            <Button onClick={handleReset} variant="primary">
              Yes, select new audio
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Button type="button" variant="link" size="xs" leftIcon={<MdChevronLeft />} onClick={onOpen}>Upload new file</Button>
      {error && (
        <>
          <Error>{ error }</Error>
          <Box borderBottom="1px solid" borderBottomColor="neutral.100" my="4" />
        </>
      )}
    </>
  );
}

AudioResetForm.propTypes = {
  error: T.node,
  setFile: T.func.isRequired
};
