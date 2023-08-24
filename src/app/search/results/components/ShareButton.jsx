import { useState } from 'react';
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
  const [ buttonLabel, setButtonLabel ] = useState('Share this page');
  const [ isDisabled, setIsDisabled ] = useState(false);

  const handleShare = () => {
    setIsDisabled(true);
    new Promise((resolve) => {
      const fileUrl = searchParams.get('q');
      const { protocol, host } = window.location;
      if (fileUrl) {
        resolve(`${protocol}//${host}/search?q=${encodeURIComponent(fileUrl)}&${appState.urlEncode(keys)}`);
        return;
      }

      setButtonLabel('Uploading audio');
      const formData = new FormData();
      formData.append('audio_file', file);
  
      fetch(`${SEARCH_API}/upload-audio/`, {
        method: 'POST',
        body: formData,
      })
        .then(r => r.json())
        .then(({ bucket_name, filename }) => {
          const fileUrl = `https://${bucket_name}.storage.googleapis.com/${filename}`;
          resolve(`${protocol}//${host}/search?q=${fileUrl}&${appState.urlEncode(keys)}`);
        });

    })
      .then(shareUrl => navigator.clipboard.writeText(shareUrl))
      .then(() => {
        setButtonLabel('URL copied to clipboard');
        setTimeout(() => {
          setButtonLabel('Share this page');
          setIsDisabled(false);
        }, 5000);
      });
  };

  return (
    <Button variant="primary" size="sm" onClick={handleShare} isDisabled={isDisabled}>{ buttonLabel }</Button>
  );
}

ShareButton.propTypes = {
  file: T.object.isRequired
};
