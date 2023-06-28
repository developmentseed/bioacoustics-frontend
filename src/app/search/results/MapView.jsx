import { useCallback, useMemo, useRef } from 'react';
import T from 'prop-types';
import { Box } from '@chakra-ui/react';
import Map, {Source, Layer} from 'react-map-gl';
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
      ['get', 'clusterNumResults'],
      { 'text-size': 12, 'text-color': '#fff', 'font-scale': 0.6 },
    ],
    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
  }
};

export default function MapView({ results }) {
  const mapRef = useRef();
  const { sites } = useSites();

  const geojson = useMemo(() => {
    const resultSites = results.reduce((accSites, result) => {
      const { site_id } = result.entity;
      let site;

      if (Object.keys(accSites).includes(site_id)) {
        site = {
          ...accSites[site_id],
          numResults: accSites[site_id].numResults + 1
        };
      } else {
        const { id, custom_longitude, custom_latitude } = sites.find(({ id }) => id === site_id);
        site = {
          id,
          lat: custom_latitude,
          lng: custom_longitude,
          numResults: 1
        };
      }

      return {
        ...accSites,
        [site_id]: site
      };
    });

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

  return (
    <Box width="500px" height="600px">
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
    </Box>
  );
}

MapView.propTypes = {
  results: T.arrayOf(TMatch).isRequired
};
