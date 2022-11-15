import React, {forwardRef, useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {mapboxPublicToken} from 'services/config';
import {locationType} from 'screens/TreeSubmission/components/MapMarking/MapMarking.web';

const options = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const RTLAPI = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js';

mapboxgl.accessToken = mapboxPublicToken;
mapboxgl.setRTLTextPlugin(RTLAPI, null, true);

interface MapProps {
  setLocation?: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

const Map = forwardRef(({setLocation, setAccuracyInMeters}: MapProps, mapRef: any) => {
  const mapContainer = useRef<any>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (mapRef.current) return;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current as unknown as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom,
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
      setLng(center.lng);
      setLat(center.lat);
      setZoom(mapRef.current.getZoom().toFixed(2));
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
      <div ref={mapContainer} style={{height: '100vh', width: '100vw'}} />
    </View>
  );
});

export default Map;
