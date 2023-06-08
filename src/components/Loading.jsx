import T from 'prop-types';
import { Center, Spinner } from '@chakra-ui/react';

export default function Loading({ size = 'md' }) {
  return (
    <Center p="5" data-testid="loading">
      <Spinner size={size} />
    </Center>
  );
}

Loading.propTypes = {
  size: T.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};
