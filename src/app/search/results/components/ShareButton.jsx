import T from 'prop-types';
import { Button } from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';

import { SEARCH_API } from '@/settings';
import { useAppState } from '../../context/appState';

const keys = [
  'bboxFilter',
  'page',
  'selectedSites',
  'selectedDates',
  'selectedTimes',
  'topMatchPerRecording',
  'clipStart',
  'clipLength'
];

export default function ShareButton({ file }) {
  const appState = useAppState();
  const searchParams = useSearchParams();

  const handleShare = () => {
    const fileUrl = searchParams.get('q');
    const { protocol, host } = window.location;

    if (fileUrl) {
      const shareUrl = `${protocol}//${host}/search?q=${encodeURIComponent(fileUrl)}&${appState.urlEncode(keys)}`;
      navigator.clipboard.writeText(shareUrl);
    } else {
      const formData = new FormData();
      formData.append('audio_file', file);
  
      return fetch(`${SEARCH_API}/upload-audio/`, {
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then(({ bucket_name, filename }) => {
          const fileUrl = `http://${bucket_name}.storage.googleapis.com/${filename}`;
          const shareUrl = `${protocol}//${host}/search?q=${fileUrl}&${appState.urlEncode(keys)}`;
          navigator.clipboard.writeText(shareUrl);
        });
    }
  };

  return (
    <Button variant="primary" size="sm" onClick={handleShare}>Share this page</Button>
  );
}

ShareButton.propTypes = {
  file: T.object.isRequired
};
