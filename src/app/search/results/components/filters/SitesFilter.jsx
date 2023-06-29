import { useCallback, useState, useMemo } from 'react';
import T from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  VStack
} from '@chakra-ui/react';

import { useSites } from '../../../context/sites';

export default function SitesFilter({ selectedSites, setSelectedSites }) {
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
        <PopoverContent pt="1" height="200px" overflowY="scroll">
          <PopoverBody>
            <Input
              size="sm"
              mb="2"
              value={siteNameFilter}
              onChange={handleFilterChange}
              aria-label="Enter site name to filter sites"
              placeholder="Enter site name to filter sites"
            />
            <CheckboxGroup onChange={handleSiteSelect} value={selectedSites}>
              <VStack align="flex-start">
                {sites
                  .filter(({ name }) => !siteNameFilter || name.toLowerCase().indexOf(siteNameFilter.toLowerCase()) !== -1)
                  .map(({ id, name }) => {
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
