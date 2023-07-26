import { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import T from 'prop-types';

export const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [appState, setAppState]  = useState({});

  const setSlice = useCallback((key, value) => {
    setAppState((previousState) => ({
      ...previousState,
      [key]: value
    }));
  }, []);
  
  const contextValue = useMemo(
    () =>({
      appState,
      setSlice
    }),
    [appState, setSlice]
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

export function useAppState(key, defaultValue) {
  const { appState, setSlice } = useContext(AppStateContext);

  useEffect(() => {
    if (!Object.keys(appState).includes(key)) {
      setSlice(key, defaultValue);
    }
  }, [appState, defaultValue, key, setSlice]);

  const setValue = useCallback(
    (value) => setSlice(key, value),
    [key, setSlice]
  );
  
  return [appState[key], setValue];
}
