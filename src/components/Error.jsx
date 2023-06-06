import T from 'prop-types';
import { Alert } from '@chakra-ui/react';

export default function Error({ children }) {
  return (
    <Alert status="warning" my="2" px="2" py="1" fontSize="sm" border="1px solid" borderColor="orange.300">{ children }</Alert>
  );
}

Error.propTypes = {
  children: T.node.isRequired
};
