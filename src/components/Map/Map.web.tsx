import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {mapboxPublicToken} from 'services/config';
import {locationType} from 'screens/TreeSubmissionV2/components/MapMarkingV2/MapMarkingV2.web';
import {useDimensions} from 'utilities/hooks/useDimensions';

const options = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const RTL_API = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js';

mapboxgl.accessToken = mapboxPublicToken;
mapboxgl.setRTLTextPlugin(RTL_API, null, true);

interface MapProps {
  setLocation?: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

const Map = forwardRef(({setLocation, setAccuracyInMeters}: MapProps, mapRef: any) => {
  const mapContainer = useRef<any>(null);
  const [locationDetail, setLocationDetail] = useState({
    lng: -79.9,
    lat: 42.35,
    zoom: 9,
  });

  const {window} = useDimensions();

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current as unknown as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [locationDetail.lng, locationDetail.lat],
      zoom: locationDetail.zoom,
    });

    // * mapbox-gl locate to user location control and user heading

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    mapRef.current.addControl(geolocate);

    // * mapbox-gl locate to user location control and user heading

    mapRef.current.on('load', () => {
      geolocate.trigger();
      const center = mapRef.current.getCenter();
      if (setLocation) {
        setLocation({
          lng: center.lng,
          lat: center.lat,
        });
      }
    });
  });

  useEffect(() => {
    function success({coords}) {
      if (coords.accuracy) {
        setAccuracyInMeters?.(coords.accuracy);
      }
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    navigator.geolocation.watchPosition(success, error, options);

    if (!mapRef.current) return;
    mapRef.current.on('move', () => {
      const center = mapRef.current.getCenter();
      setLocationDetail({
        lng: center.lng,
        lat: center.lat,
        zoom: mapRef.current.getZoom().toFixed(2),
      });
      if (setLocation) {
        setLocation({
          lng: center.lng,
          lat: center.lat,
        });
      }
    });
  }, []);
  return (
    <View>
      <div ref={mapContainer} style={{height: window.height, maxWidth: '768px'}} />
    </View>
  );
});

export default Map;
