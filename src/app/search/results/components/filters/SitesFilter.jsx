import { useCallback, useState } from 'react';
import T from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Heading,
  Modal,
  ModalContent,
  ModalBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { MdMap } from 'react-icons/md';

import { useSites } from '../../../context/sites';

export default function SitesFilter({ selectedSites, setSelectedSites }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [siteNameFilter, setSiteNameFilter] = useState('');
  const { sites } = useSites();

  const handleSiteSelect = useCallback((checked) => {
    setSelectedSites(checked.map(id => parseInt(id, 10)));
  }, [setSelectedSites]);

  const handleFilterChange = useCallback(
    (e) => setSiteNameFilter(e.target.value),
    []
  );

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button size="sm" variant="outline" rightIcon={<MdKeyboardArrowDown />}>Sites</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent pt="1">
          <PopoverBody>
            <Input
              size="sm"
              value={siteNameFilter}
              onChange={handleFilterChange}
              aria-label="Enter site name to filter sites"
              placeholder="Enter site name to filter sites"
            />
            <Box height="200px" overflowY="scroll" my="2">
              <CheckboxGroup onChange={handleSiteSelect} value={selectedSites}>
                <VStack align="flex-start">
                  {sites
                    .filter(({ name }) => !siteNameFilter || name.toLowerCase().indexOf(siteNameFilter.toLowerCase()) !== -1)
                    .map(({ id, name }) => {
                      return <Checkbox key={id} value={id}>{name}</Checkbox>;
                    })}
                </VStack>
              </CheckboxGroup>
            </Box>
            <Button leftIcon={<MdMap />} onClick={onOpen} variant="outline" size="sm">Select on map</Button>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalContent>
                <ModalBody py="7">
                  <Box mb="3">
                    <Heading as="h3" size="md" color="primary.500">Select sites</Heading>
                  </Box>
                  <Box height="500px" bgColor="neutral.100">
                    Map
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

SitesFilter.propTypes = {
  selectedSites: T.arrayOf(T.number).isRequired,
  setSelectedSites: T.func.isRequired
};
