import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import T from 'prop-types';
import { useSearchParams } from 'next/navigation';

export const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [appState, setAppState]  = useState({});
  const searchParams = useSearchParams();

  const setSlice = useCallback((key, value) => {
    setAppState((previousState) => {
      return {
        ...previousState,
        [key]: {
          value,
          config: previousState[key].config
        }
      };
    });
  }, []);
  
  const initSlice = useCallback((key, config) => {
    const { default: defaultValue, ...restConfig } = config;
    const queryValue = searchParams.get(key);
    const value = queryValue ? restConfig.decode(queryValue) : defaultValue;

    setAppState((previousState) => {
      return {
        ...previousState,
        [key]: {
          value,
          config: restConfig
        }
      };
    });
  }, [searchParams]);

  const urlEncode = useCallback((keys) => {
    return keys
      .map(k => {
        const { value, config } = appState[k];
        const encodedVal = config.encode(value);
        if (encodedVal !== null && encodedVal !== undefined) {
          return `${k}=${encodeURIComponent(encodedVal)}`;
        }
        return '';
      })
      .filter(value => !!value)
      .join('&');
  }, [appState]);
  
  const contextValue = useMemo(
    () =>({
      appState,
      setSlice,
      urlEncode,
      initSlice
    }),
    [appState, setSlice, urlEncode, initSlice]
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      { children }
    </AppStateContext.Provider>
  );
}

AppStateProvider.propTypes = {
  children: T.node.isRequired
};

export function useAppState(key, config) {
  const { appState, setSlice, initSlice, urlEncode } = useContext(AppStateContext);

  useEffect(() => {
    if (key && !Object.keys(appState).includes(key)) {
      initSlice(key, config);
    }
  }, [appState, config, key, initSlice]);

  const setValue = useCallback(
    (value) => setSlice(key, value),
    [key, setSlice]
  );

  if (!key) return { urlEncode };

  return [appState[key]?.value, setValue];
}
