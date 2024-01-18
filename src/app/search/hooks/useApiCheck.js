import { useEffect, useState } from 'react';
import { STATUS_CHECK } from '@/settings';

function useApiCheck() {
  const [ isChecking, setIsChecking ] =  useState(false);
  const [ hasError, setHasError ] =  useState(false);

  useEffect(() => {
    setIsChecking(true);
    fetch(STATUS_CHECK)
      .then(r => r.json())
      .then(({ status }) => setHasError(status !== 'good'))
      .catch(() => setHasError(true))
      .finally(() => setIsChecking(false));
  }, []);

  return {
    isChecking,
    hasError
  };
}

export default useApiCheck;
