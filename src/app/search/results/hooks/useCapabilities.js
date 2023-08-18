import { SEARCH_API } from '@/settings';
import { useEffect, useState } from 'react';

export default function useCapabilities() {
  const [ canStoreFile, setCanStoreFile ] = useState(false);

  useEffect(() => {
    fetch(`${SEARCH_API}/capabilities/`)
      .then(r => r.json())
      .then(({ public_storage }) => setCanStoreFile(public_storage));
  }, []);

  return { canStoreFile };
}
