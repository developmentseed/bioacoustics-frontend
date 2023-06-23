import { useMemo } from 'react';
import T from 'prop-types';
import { Box } from '@chakra-ui/react';

const SCALE = 12;
const NUM_TICKS = 6;

function Label({ value, height }) {
  return <Box position="absolute" right="4px" bottom={`${value * height / SCALE - 10}px`}>{value.toFixed(1)}</Box>;
}

Label.propTypes = {
  value: T.number.isRequired,
  height: T.number.isRequired
};

export default function FrequencyLegend({ height, width }) {
  const ticks = useMemo(() => {
    const tickFrequency = SCALE / NUM_TICKS;
    const tickLabels = [];
    for (let i = SCALE; i >= 0; i -= tickFrequency) {
      tickLabels.push(<Label key={i} value={i} height={height} />);
    }
    return tickLabels;
  }, [height]);
  
  return (
    <Box w={width} fontSize="xs" position="relative">
      <Box
        position="absolute"
        w={height}
        left="0"
        bottom="0"
        fontWeight="bold"
        transformOrigin="0 0"
        transform="rotate(-90deg)"
      >
        Frequency (KHz)
      </Box>
      {ticks}
    </Box>
  );
}

FrequencyLegend.propTypes = {
  width: T.string.isRequired,
  height: T.number.isRequired
};
