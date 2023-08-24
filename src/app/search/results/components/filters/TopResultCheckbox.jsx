import T from 'prop-types';
import { Checkbox } from '@chakra-ui/react';

export default function TopResultCheckbox({ isChecked, onChange }) {
  return (
    <Checkbox isChecked={isChecked} onChange={onChange} colorScheme="green">Best match per recording only</Checkbox>
  );
}

TopResultCheckbox.propTypes = {
  isChecked: T.bool,
  onChange: T.func.isRequired
};
