import { Button } from '@chakra-ui/react';
import { useAppState } from '../../context/appState';

const keys = [
  'bboxFilter',
  'page',
  'selectedSites',
  'selectedDates',
  'selectedTimes',
  'topMatchPerRecording'
];

export default function ShareButton() {
  const appState = useAppState();

  const handleShare = () => {
    const { protocol, host } = window.location;
    const shareUrl = `${protocol}//${host}/?${appState.urlEncode(keys)}`;
    navigator.clipboard.writeText(shareUrl);

  };

  return (
    <Button variant="primary" size="sm" onClick={handleShare}>Share this page</Button>
  );
}
