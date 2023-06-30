import { useCallback, useState } from 'react';
import T from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Input,
  Heading,
  Modal,
  ModalContent,
  ModalBody,
  ModalOverlay,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { MdClose, MdKeyboardArrowDown, MdMap, MdDraw } from 'react-icons/md';

import { useSites } from '../../../context/sites';
import SitesFilterMap from './SitesFilterMap';

export default function SitesFilter({ selectedSites, setSelectedSites }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [siteNameFilter, setSiteNameFilter] = useState('');
  const [isDrawing, setIsDrawing] = useState();
  const [filterArea, setFilterArea] = useState();
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
              <ModalOverlay />
              <ModalContent>
                <ModalBody py="7">
                  <Flex mb="3" gap="2">
                    <Heading as="h3" size="md" color="primary.500" flex="1">Select sites</Heading>
                    <Button variant="outline" leftIcon={<MdDraw />} size="xs" onClick={() => setIsDrawing(true)}>Draw</Button>
                    <Button variant="outline" leftIcon={<MdClose />} size="xs" onClick={onClose}>Close</Button>
                  </Flex>
                  {selectedSites.length > 0 && (
                    <Flex mb="3">
                      <Text as="span" fontSize="sm" mr="3">{selectedSites.length} selected</Text>
                      <Button
                        onClick={() => setSelectedSites([])}
                        variant="link"
                        textTransform="uppercase"
                        letterSpacing="1px"
                        fontWeight="normal"
                        size="sm"
                        leftIcon={<MdClose />}
                      >
                        Clear
                      </Button>
                    </Flex>
                  )}
                  <Box height="500px" bgColor="neutral.100">
                    <SitesFilterMap
                      selectedSites={selectedSites}
                      setSelectedSites={setSelectedSites}
                      isDrawing={isDrawing}
                      setIsDrawing={setIsDrawing}
                      filterArea={filterArea}
                      setFilterArea={setFilterArea}
                    />
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
