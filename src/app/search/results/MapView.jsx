import { useCallback, useEffect, useMemo, useState } from 'react';
import T from 'prop-types';
import { Box, Checkbox } from '@chakra-ui/react';
import Map, { Source, Layer }  from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { MAPBOX_TOKEN } from '@/settings';
import { TMatch } from '@/types';
import { useSites } from '../context/sites';

const markerStyle = {
  id: 'sites',
  type: 'circle',
  paint: {
    'circle-radius': 8,
    'circle-color': '#037447',
    'circle-stroke-color': '#7EC440',
    'circle-stroke-width': 2
  }
};

const clusterLabelStyle = {
  id: 'cluster-label',
  type: 'symbol',
  filter: ['has', 'clusterNumResults'],
  layout: {
    'text-field': [
      'format',
      ['get', 'point_count'],
      { 'text-size': 12, 'text-color': '#fff', 'font-scale': 0.6 },
    ],
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  }
};

export default function MapView({ results, bboxFilter, setBboxFilter }) {
  const [ map, setMap ] = useState();
  const { sites } = useSites();
  const [ filterByMapBbox, setFilterByMapBbox ] = useState(false);

  const geojson = useMemo(() => {
    const resultSites = results.reduce((accSites, result) => {
      const { site_id } = result.entity;

      if (Object.keys(accSites).includes(site_id)) {
        return {
          ...accSites,
          [site_id]: {
            ...accSites[site_id],
            numResults: accSites[site_id].numResults + 1
          }
        };
      }

      const site = sites.find(({ id }) => id === site_id);

      if (site) {
        const { id, custom_longitude, custom_latitude } = site;
        return {
          ...accSites,
          [site_id]: {
            id,
            lat: custom_latitude,
            lng: custom_longitude,
            numResults: 1
          }
        };
      }

      return accSites;
    }, []);

    return ({
      type: 'FeatureCollection',
      features: Object.values(resultSites).map(({ id, lat, lng, numResults }) => {
        return ({
          type: 'Feature',
          id,
          geometry: { type: 'Point', coordinates: [lng, lat] },
          properties: { id, numResults }
        });
      })
    });
  }, [results, sites]);

  const handleClusterClick = useCallback((e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['cluster-label'],
    });
    if (!features.length > 0) return;

    const clusterId = features[0].properties.cluster_id;
    map
      .getSource('results')
      .getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
  }, [map]);

  useEffect(() => {
    if (map && bboxFilter) {
      map.fitBounds(bboxFilter);
      setFilterByMapBbox(true);
    }
  // We only want to run this effect after the map is first initialised
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    // Bail this effect if the map is not initialised. This is avoid resetting
    // the bboxFilter before the map is loaded with the bbox from the URL.
    if (!map) return;

    if (!filterByMapBbox) {
      setBboxFilter();
    } else {
      setBboxFilter(map.getBounds());
    }
  }, [filterByMapBbox, map, setBboxFilter]);

  const handleMoveEnd = () => {
    if (!filterByMapBbox) return;
    setBboxFilter(map.getBounds());
  };

  const handleMapLoad = (e) => {
    setMap(e.target);
  };

  return (
    <Box flexBasis="500px" minH="300px" maxH={['500px', null, 'calc(100vh - 2.5rem)']} position={['relative', null, 'sticky']} top={['initial', null, 5]} borderRadius={4} boxShadow="base">
      <Map
        initialViewState={{
          longitude: 134.396315,
          latitude: -25.7302804,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLabelStyle.id]}
        onClick={handleClusterClick}
        onMoveEnd={handleMoveEnd}
        onLoad={handleMapLoad}
        style={{ position: 'absolute', height: '100%', top: 0, bottom: 0 }}
      >
        <Source
          id="results"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={30}
          clusterProperties={{ clusterNumResults: ['+', ['get', 'numResults']] }}
        >
          <Layer {...markerStyle} />
          <Layer {...clusterLabelStyle} />
        </Source>
      </Map>
      <Box
        position="absolute"
        right="3"
        top="3"
        bgColor="white"
        border="1px solid"
        borderColor="primary.400"
        borderRadius="3px"
        px="2"
        py="1"
        fontSize="sm"
      >
        <Checkbox
          size="sm"
          colorScheme="green"
          isChecked={filterByMapBbox}
          onChange={(e) => setFilterByMapBbox(e.target.checked)}
        >
          Search as I move the map
        </Checkbox>
      </Box>
    </Box>
  );
}

MapView.propTypes = {
  results: T.arrayOf(TMatch).isRequired,
  setBboxFilter: T.func.isRequired,
  bboxFilter: T.object
};
