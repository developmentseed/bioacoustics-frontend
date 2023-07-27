import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import T from 'prop-types';

export const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [appState, setAppState]  = useState({});

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
  
  const initSlice = (key, config) => {
    const { default: defaultValue, ...restConfig } = config;
    setAppState((previousState) => {
      return {
        ...previousState,
        [key]: {
          value: defaultValue,
          config: restConfig
        }
      };
    });
  };

  const urlEncode = useCallback((keys) => {
    const queryParams = keys
      .map(k => {
        const { value, config } = appState[k];
        return `${k}=${config.encode(value)}`;
      })
      .join('&');
    return encodeURIComponent(queryParams);
  }, [appState]);
  
  const contextValue = useMemo(
    () =>({
      appState,
      setSlice,
      urlEncode,
      initSlice
    }),
    [appState, urlEncode, setSlice]
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
