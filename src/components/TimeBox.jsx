import T from 'prop-types';
import { Box } from '@chakra-ui/react';

const formatTime = (time) => {
  const currentTimeInSeconds = Math.floor(time);
  let minutes = Math.floor(currentTimeInSeconds / 60).toString().padStart(2, '0');
  let seconds = (currentTimeInSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};

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
