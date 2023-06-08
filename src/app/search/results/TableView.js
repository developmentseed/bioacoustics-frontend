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
import { sitenameDisplay } from './utils';

function ResultRow({ result }) {
  const { id, distance, entity: { file_timestamp } } = result;
  return (
    <Tr>
      <Td>{ id }</Td>
      <Td>{ distance }</Td>
      <Td>{ sitenameDisplay(result) }</Td>
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
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Distance</Th>
            <Th>Site</Th>
            <Th>Timestamp</Th>
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
