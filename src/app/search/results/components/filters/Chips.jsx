import T from 'prop-types';
import { Box, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';

import { formatDate } from '@/utils';
import formatHour from './formatHour';

function Chip({ children, onClear }) {
  return (
    <Tag
      size="sm"
      borderRadius="full"
      variant="solid"
      bgColor="primary.400"
    >
      <TagLabel>{children}</TagLabel>
      <TagCloseButton onClick={onClear} />
    </Tag>
  );
}

Chip.propTypes = {
  children: T.node.isRequired,
  onClear: T.func.isRequired
};

export default function Chips ({
  selectedSites,
  setSelectedSites,
  selectedDates,
  setSelectedDates,
  selectedTimes,
  setSelectedTimes
}) {
  return (
    <Box>
      { selectedSites.length > 0 && (
        <Chip onClear={() => setSelectedSites([])}>Sites ({selectedSites.length})</Chip>
      )}
      { selectedDates.length > 0 && (
        <Chip onClear={() => setSelectedDates([])}>
          {formatDate(selectedDates[0])} {selectedDates[1] && `- ${formatDate(selectedDates[1])}`}
        </Chip>
      )}
      { (selectedTimes[0] !== 0 || selectedTimes[1] !== 24) && (
        <Chip onClear={() => setSelectedTimes([0, 24])}>
          {formatHour(selectedTimes[0])} - {formatHour(selectedTimes[1])} UTC
        </Chip>
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
  setSelectedTimes: T.func.isRequired,
};
