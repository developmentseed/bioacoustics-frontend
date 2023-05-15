'use client';
import { useState } from 'react';
import SpectrogramPlayer from '@/components/audio/SpectrogramPlayer';

export default function Upload() {
  const [ file, setFile ] = useState();

  const handleFileSelect = (e) => setFile(e.target.files[0]);

  return (
    <main>
      <h1>Upload</h1>
      {!file ? (
        <form>
          <input type="file" name="file" onChange={handleFileSelect} />
        </form>
      ) : (
        <SpectrogramPlayer file={file} />
      )}
    </main>
  );
}
