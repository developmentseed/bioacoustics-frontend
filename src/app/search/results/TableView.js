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
import { sitenameDisplay, getAudioUrlfromImageUrl } from './utils';
import AudioPlayer from './AudioPlayer';

function ResultRow({ result }) {
  const { distance, entity: { file_timestamp, file_seq_id, image_url } } = result;
  const audioUrl = getAudioUrlfromImageUrl(image_url);

  return (
    <Tr>
      <Td>
        <AudioPlayer audioSrc={audioUrl} />
      </Td>
      <Td>{ distance.toFixed(4) }</Td>
      <Td>{ sitenameDisplay(result) }</Td>
      <Td>{ formatDate(file_timestamp) }</Td>
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
            <Th py={2} color="blackAlpha.600">Timestamp</Th>
            <Th />
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
