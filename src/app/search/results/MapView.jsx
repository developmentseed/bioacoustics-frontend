import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const mapRef = useRef();
  const { sites } = useSites();
  const [ filterByMapBbox, setFilterByMapBbox ] = useState(false);

  // Set the filterByMapBbox if the page is initialised with the bbox query param
  useEffect(() => {
    if (bboxFilter && !filterByMapBbox) {
      setFilterByMapBbox(true);
    }
  }, [filterByMapBbox, bboxFilter]);

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
    const map = mapRef.current;
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
  }, []);

  useEffect(() => {
    if (!filterByMapBbox) {
      setBboxFilter();
    } else {
      setBboxFilter(mapRef.current.getBounds());
    }
  }, [filterByMapBbox, setBboxFilter]);

  const handleMoveEnd = () => {
    if (!filterByMapBbox) return;
    setBboxFilter(mapRef.current.getBounds());
  };

  return (
    <Box flexBasis="500px" height="600px" position="sticky" top="5">
      <Map
        initialViewState={{
          longitude: 134.396315,
          latitude: -25.7302804,
          zoom: 3
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        ref={mapRef}
        interactiveLayerIds={[clusterLabelStyle.id]}
        onClick={handleClusterClick}
        onMoveEnd={handleMoveEnd}
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
          color="primary.400"
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
  bboxFilter: T.object,
  setBboxFilter: T.func.isRequired,
};
