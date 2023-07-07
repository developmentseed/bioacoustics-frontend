import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import T from 'prop-types';

export const SitesContext = createContext(null);

export function SitesProvider({ children }) {
  const [ sites, setSites ] = useState([]);

  useEffect(() => {
    fetch('https://api.bioacoustics.ds.io/api/v1/a2o/sites?direction=asc&items=341&order_by=name')
      .then(r => r.json())
      .then(r => r.data.filter(({ custom_latitude, custom_longitude }) => custom_latitude && custom_longitude))
      .then(setSites);
  }, []);

  const contextValue = useMemo(() =>({ sites }), [sites]);

  return (
    <SitesContext.Provider value={contextValue}>
      { children }
    </SitesContext.Provider>
  );
}

SitesProvider.propTypes = {
  children: T.node.isRequired
};

export function useSites() {
  const { sites } = useContext(SitesContext);
  return { sites };
}
