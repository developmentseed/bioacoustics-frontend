import T from 'prop-types';
import { Box } from '@chakra-ui/react';

export default function MapView({ width }) {
  return (
    <Box width={width}>
      Map
    </Box>
  );
}

MapView.propTypes = {
  width: T.number,
};
