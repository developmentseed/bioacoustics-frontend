import { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import T from 'prop-types';
import Map, { Source, Layer, Popup, useControl } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import pointsWithinPolygon from '@turf/points-within-polygon';

import { MAPBOX_TOKEN } from '@/settings';
import { useSites } from '../../../context/sites';

function DrawControl(props) {
  const { isEnabled, selectedSites, onComplete, filterArea } = props;

  const { add, changeMode, deleteAll, modes } = useControl(
    () => new MapboxDraw(props),
    ({ map }) => {
      map.on('draw.create', onComplete);
      map.on('draw.update', onComplete);
    },
    ({ map }) => {
      map.off('draw.create', onComplete);
      map.off('draw.update', onComplete);
    },
    {
      position: props.position
    }
  );

  useEffect(() => {
    if (filterArea) add(filterArea);
  }, [add, filterArea]);

  useEffect(() => {
    if (isEnabled) {
      deleteAll();
      changeMode(modes.DRAW_POLYGON);
    }
  }, [changeMode, deleteAll, isEnabled, modes]);

  useEffect(() => {
    if (selectedSites.length === 0) {
      deleteAll();
    }
  }, [deleteAll, selectedSites]);

  return null;
}

DrawControl.propTypes = {
  isEnabled: T.bool,
  selectedSites: T.arrayOf(T.number).isRequired,
  position: T.string,
  onComplete: T.func.isRequired,
  filterArea: T.object,
};

const markerStyle = {
  id: 'sites',
  type: 'circle',
  paint: {
    'circle-radius': 5,
    'circle-color': [
      'case',
      ['==', ['get', 'isSelected'], true],
      '#037447',
      '#fff',
    ],
    'circle-stroke-color': '#7EC440',
    'circle-stroke-width': 2
  }
};


export default function SitesFilterMap({ selectedSites, setSelectedSites, isDrawing, setIsDrawing, filterArea, setFilterArea}) {
  const { sites } = useSites();
  const mapRef = useRef();
  const [hoveredSite, setHoveredSite] = useState();

  const geojson = useMemo(() => {
    return ({
      type: 'FeatureCollection',
      features: sites.map(({ id, name, custom_latitude, custom_longitude }) => {
        return ({
          type: 'Feature',
          id,
          geometry: { type: 'Point', coordinates: [custom_longitude, custom_latitude] },
          properties: {
            id,
            name,
            isSelected: selectedSites.includes(id)
          }
        });
      })
    });
  }, [selectedSites, sites]);

  const toggleSiteSelect = useCallback((id) => {
    if (selectedSites.includes(id)) {
      setSelectedSites(selectedSites.filter(site => site !== id));
    } else {
      setSelectedSites([...selectedSites, id]);
    }
  }, [selectedSites, setSelectedSites]);

  const handleMarkerClick = useCallback((e) => {
    const map = mapRef.current;
    const features = map.queryRenderedFeatures(e.point, {
      layers: [markerStyle.id],
    });
    if (!features.length > 0) return;

    const clusterId = features[0].properties.cluster_id;
    if (clusterId) {
      // Clicked on a cluster marker, zoom in
      map
        .getSource('sites')
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    } else {
      // click on a site, toggle selection
      toggleSiteSelect(features[0].id);
    }
  }, [toggleSiteSelect]);

  const handleMarkerHover = (e) => {
    const map = mapRef.current;
    if (!map.getLayer(markerStyle.id)) return;

    const features = map.queryRenderedFeatures(e.point, {
      layers: [markerStyle.id],
    });

    if (features.length === 0) {
      setHoveredSite();
      return;
    }

    const { name, cluster_id } = features[0].properties;
    const [ longitude, latitude ] = features[0].geometry.coordinates;
    if (!cluster_id) {
      setHoveredSite({ name, longitude, latitude });
    } else {
      setHoveredSite();
    }
  };

  const handleDrawChange = useCallback(({ features }) => {
    setIsDrawing(false);
    setFilterArea(features[0]);
    const sitesInArea = pointsWithinPolygon(geojson, features[0]);
    setSelectedSites(sitesInArea.features.map(({ id }) => id));
  }, [geojson, setFilterArea, setIsDrawing, setSelectedSites]);

  return (
    <Map
      initialViewState={{
        longitude: 134.396315,
        latitude: -26.7302804,
        zoom: 3
      }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      ref={mapRef}
      interactiveLayerIds={[markerStyle.id]}
      onClick={handleMarkerClick}
      onMouseMove={handleMarkerHover}
    >
      <Source
        id="sites"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={30}
        clusterProperties={{ clusterNumResults: ['+', ['get', 'numResults']] }}
      >
        <Layer {...markerStyle} />
      </Source>
      {hoveredSite && (
        <Popup
          anchor="bottom"
          longitude={Number(hoveredSite.longitude)}
          latitude={Number(hoveredSite.latitude)}
          closeButton={false}
        >
          { hoveredSite.name }
        </Popup>
      )}
      <DrawControl
        position="top-left"
        displayControlsDefault={false}
        selectedSites={selectedSites}
        isEnabled={isDrawing}
        onComplete={handleDrawChange}
        filterArea={filterArea}
      />
    </Map>
  );
}

SitesFilterMap.propTypes = {
  selectedSites: T.arrayOf(T.number).isRequired,
  setSelectedSites: T.func.isRequired,
  isDrawing: T.bool,
  setIsDrawing: T.func.isRequired,
  filterArea: T.object,
  setFilterArea: T.func.isRequired
};
