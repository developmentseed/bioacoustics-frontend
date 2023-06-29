import { useCallback, useRef, useState, useMemo } from 'react';
import T from 'prop-types';
import { MdKeyboardArrowDown } from 'react-icons/md';
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Input,
  Heading,
  Modal,
  ModalContent,
  ModalBody,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  VStack,
  useDisclosure
} from '@chakra-ui/react';
import { MdMap } from 'react-icons/md';
import Map, { Source, Layer, Popup } from 'react-map-gl';

import { MAPBOX_TOKEN } from '@/settings';
import { useSites } from '../../../context/sites';

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

export default function SitesFilter({ selectedSites, setSelectedSites }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [siteNameFilter, setSiteNameFilter] = useState('');
  const [hoveredSite, setHoveredSite] = useState();
  const mapRef = useRef();
  const { sites } = useSites();

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

  const handleSiteSelect = useCallback((checked) => {
    setSelectedSites(checked.map(id => parseInt(id, 10)));
  }, [setSelectedSites]);

  const handleFilterChange = useCallback(
    (e) => setSiteNameFilter(e.target.value),
    []
  );

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

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Button size="sm" variant="outline" rightIcon={<MdKeyboardArrowDown />}>Sites</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent pt="1">
          <PopoverBody>
            <Input
              size="sm"
              value={siteNameFilter}
              onChange={handleFilterChange}
              aria-label="Enter site name to filter sites"
              placeholder="Enter site name to filter sites"
            />
            <Box height="200px" overflowY="scroll" my="2">
              <CheckboxGroup onChange={handleSiteSelect} value={selectedSites}>
                <VStack align="flex-start">
                  {sites
                    .filter(({ name }) => !siteNameFilter || name.toLowerCase().indexOf(siteNameFilter.toLowerCase()) !== -1)
                    .map(({ id, name }) => {
                      return <Checkbox key={id} value={id}>{name}</Checkbox>;
                    })}
                </VStack>
              </CheckboxGroup>
            </Box>
            <Button leftIcon={<MdMap />} onClick={onOpen} variant="outline" size="sm">Select on map</Button>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
              <ModalContent>
                <ModalBody py="7">
                  <Box mb="3">
                    <Heading as="h3" size="md" color="primary.500">Select sites</Heading>
                  </Box>
                  <Box height="500px" bgColor="neutral.100">
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
                    </Map>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

SitesFilter.propTypes = {
  selectedSites: T.arrayOf(T.number).isRequired,
  setSelectedSites: T.func.isRequired
};
