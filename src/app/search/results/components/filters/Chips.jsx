import T from 'prop-types';
import { Box, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { formatDate } from '@/utils';

export default function Chips ({ selectedSites, setSelectedSites, selectedDates, setSelectedDates, selectedTimes }) {
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
      { selectedDates.length > 0 && (
        <Tag
          size="sm"
          borderRadius="full"
          variant="solid"
          bgColor="primary.400"
        >
          <TagLabel>{formatDate(selectedDates[0])} {selectedDates[1] && `- ${formatDate(selectedDates[1])}`}</TagLabel>
          <TagCloseButton onClick={() => setSelectedDates([])} />
        </Tag>
      )}
    </Box>
  );
}

Chips.propTypes = {
  selectedSites: T.arrayOf(T.number).isRequired,
  setSelectedSites: T.func.isRequired,
  selectedDates: T.array.isRequired,
  setSelectedDates: T.func.isRequired,
  selectedTimes: T.arrayOf(T.number).isRequired,
};
