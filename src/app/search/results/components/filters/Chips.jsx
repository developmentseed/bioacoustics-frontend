import T from 'prop-types';
import { Box, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';

export default function Chips ({ selectedSites, setSelectedSites, selectedDates, selectedTimes }) {
  return (
    <Box>
      { selectedSites.length > 0 && (
        <Tag
          size="sm"
          borderRadius="full"
          variant="solid"
          bgColor="primary.400"
        >
          <TagLabel>Sites ({selectedSites.length})</TagLabel>
          <TagCloseButton onClick={() => setSelectedSites([])} />
        </Tag>
      )}
    </Box>
  );
}

Chips.propTypes = {
  selectedSites: T.arrayOf(T.number).isRequired,
  setSelectedSites: T.func.isRequired,
  selectedDates: T.array.isRequired,
  selectedTimes: T.arrayOf(T.number).isRequired,
};
