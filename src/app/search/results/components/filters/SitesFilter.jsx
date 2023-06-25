import T from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';

import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from '@chakra-ui/react';

import { useSites } from '../../../context/sites';

export default function SitesFilter({ setSelectedSites }) {
  const { sites } = useSites();

  return (
    <Menu closeOnSelect={false}>
      <MenuButton as={Button} size="sm" variant="outline" rightIcon={<MdKeyboardArrowDown />}>
        Sites
      </MenuButton>
      <MenuList zIndex="11" fontSize="sm" height="200px" overflowY="scroll">
        <MenuOptionGroup type="checkbox" onChange={setSelectedSites}>
          {sites.map(({ id, name }) => <MenuItemOption key={id} value={id}>{name}</MenuItemOption>)}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}

SitesFilter.propTypes = {
  setSelectedSites: T.func.isRequired
};
