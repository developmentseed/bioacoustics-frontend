import { useCallback } from 'react';
import T from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  VStack
} from '@chakra-ui/react';

import { useSites } from '../../../context/sites';

export default function SitesFilter({ selectedSites, setSelectedSites }) {
  const { sites } = useSites();

  const onChange = useCallback((checked) => {
    setSelectedSites(checked.map(id => parseInt(id, 10)));
  }, [setSelectedSites]);

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button size="sm" variant="outline" rightIcon={<MdKeyboardArrowDown />}>Sites</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent pt="1" height="200px" overflowY="scroll">
          <PopoverBody>
            <CheckboxGroup onChange={onChange} value={selectedSites}>
              <VStack align="flex-start">
                {sites.map(({ id, name }) => {
                  return <Checkbox key={id} value={id}>{name}</Checkbox>;
                })}
              </VStack>
            </CheckboxGroup>
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
