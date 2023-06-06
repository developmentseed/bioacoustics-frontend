import T from 'prop-types';
import { Box } from '@chakra-ui/react';
import { formatTime } from '@/utils';

export default function TimeBox({ time = 0 }) {
  return (
    <Box fontSize="sm" border="1px solid" borderColor="primary.400" borderRadius="2px" px="1">
      { formatTime(time) }
    </Box>
  );
}

TimeBox.propTypes = {
  time: T.number
};
