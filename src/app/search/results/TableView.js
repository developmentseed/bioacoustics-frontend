import T from 'prop-types';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { TMatch } from '@/types';
import { formatDate } from '@/utils';

function ResultRow({ result }) {
  const { id, distance, entity: { site_name, subsite_name, file_timestamp } } = result;
  return (
    <Tr>
      <Td>{ id }</Td>
      <Td>{ distance }</Td>
      <Td>{ site_name }</Td>
      <Td>{ subsite_name }</Td>
      <Td>{ formatDate(file_timestamp) }</Td>
    </Tr>
  );
}

ResultRow.propTypes = {
  result: TMatch.isRequired
};

export default function TableView({ results }) {
  return (
    <TableContainer>
      <Table size="sm" bg="white">
        <Thead>
          <Tr>
            <Th py={2} color="blackAlpha.600">ID</Th>
            <Th py={2} color="blackAlpha.600">Distance</Th>
            <Th py={2} color="blackAlpha.600">Site name</Th>
            <Th py={2} color="blackAlpha.600">Subsite</Th>
            <Th py={2} color="blackAlpha.600">Timestamp</Th>
          </Tr>
        </Thead>
        <Tbody data-testid="results-table">
          {results.map((result) => <ResultRow key={result.id} result={result} />)}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

TableView.propTypes = {
  results: T.arrayOf(TMatch)
};
