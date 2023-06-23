import T from 'prop-types';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { MdOpenInNew } from 'react-icons/md';
import { TMatch } from '@/types';
import { formatDate } from '@/utils';
import { sitenameDisplay, } from './utils';
import AudioPlayer from './AudioPlayer';

function ResultRow({ result }) {
  const { distance, entity: { file_timestamp, clip_offset_in_file, file_seq_id, audio_url } } = result;

  return (
    <Tr>
      <Td>
        <AudioPlayer audioSrc={audio_url} />
      </Td>
      <Td>{ distance.toFixed(4) }</Td>
      <Td>{ sitenameDisplay(result) }</Td>
      <Td>{ formatDate(file_timestamp) }</Td>
      <Td>{ formatDate(file_timestamp + clip_offset_in_file) }</Td>
      <Td>
        <IconButton as={Link} variant="link" href={`https://data.acousticobservatory.org/listen/${file_seq_id}`} target="_blank" icon={<MdOpenInNew />} size="sm" title="Full Recording" display="inline" />
      </Td>
    </Tr>
  );
}

ResultRow.propTypes = {
  result: TMatch.isRequired
};

export default function TableView({ results }) {
  return (
    <TableContainer bg="white" boxShadow="base" borderRadius={4}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th />
            <Th py={2} color="blackAlpha.600">Distance</Th>
            <Th py={2} color="blackAlpha.600">Site</Th>
            <Th py={2} color="blackAlpha.600">Recorded</Th>
            <Th py={2} color="blackAlpha.600">Result</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody data-testid="results-table">
          {results.map((result) => <ResultRow key={result.entity.audio_url} result={result} />)}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

TableView.propTypes = {
  results: T.arrayOf(TMatch)
};
