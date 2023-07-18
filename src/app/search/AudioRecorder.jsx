import T from 'prop-types';
import fixWebmDuration from 'fix-webm-duration';

import { Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function AudioRecorder({ setFile }) {
  const [ mediaRecorder, setMediaRecorder ] = useState();
  const handleRecordStart = () => {
    const chunks = [];
    const startTime = Date.now();

    const handleData = (({ data }) => {
      data && data.size > 0 && chunks.push(data);
    });
    const handleRecordStop = async () => {
      const duration = Date.now() - startTime;
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const blobWithDuration = await fixWebmDuration(blob, duration, {  logger: false });
      const name = `Recording ${new Date().toUTCString()}.webm`;
      setFile([new File([blobWithDuration], name, { type: 'audio/webm' })]);
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const m = new MediaRecorder(stream);
        m.addEventListener('dataavailable', handleData);
        m.addEventListener('stop', handleRecordStop);
    
        m.start();
        setMediaRecorder(m);
      });
  };

  const handleRecordStop = () => mediaRecorder.stop();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={mediaRecorder ? handleRecordStop : handleRecordStart}
    >
      {mediaRecorder ? 'Stop recording' : 'Record audio'}
    </Button>
  );
}

AudioRecorder.propTypes = {
  setFile: T.func.isRequired
};
