import T from 'prop-types';
import {
  Checkbox,
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

function ResultRow({ result, toggleSelect, isSelected }) {
  const { distance, entity: { file_timestamp, clip_offset_in_file, file_seq_id, audio_url } } = result;

  return (
    <Tr>
      <Td>
        <Checkbox
          aria-label="Click to select the result"
          isChecked={isSelected}
          onChange={() => toggleSelect(result.entity.audio_url)}
        />
      </Td>
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
  result: TMatch.isRequired,
  toggleSelect: T.func.isRequired,
  isSelected: T.bool
};

export default function TableView({ results, selectedResults, toggleSelect }) {
  return (
    <TableContainer bg="white" boxShadow="base" borderRadius={4}>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th />
            <Th />
            <Th py={2} color="blackAlpha.600">Distance</Th>
            <Th py={2} color="blackAlpha.600">Site</Th>
            <Th py={2} color="blackAlpha.600">Recorded</Th>
            <Th py={2} color="blackAlpha.600">Result</Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody data-testid="results-table">
          {results.map((result) => (
            <ResultRow
              key={result.entity.audio_url}
              result={result}
              toggleSelect={toggleSelect}
              isSelected={selectedResults.includes(result.entity.audio_url)}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

TableView.propTypes = {
  results: T.arrayOf(TMatch),
  selectedResults: T.arrayOf(T.string).isRequired,
  toggleSelect: T.func.isRequired
};
