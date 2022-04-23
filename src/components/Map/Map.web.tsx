import mapboxgl from 'mapbox-gl';
import React, {useEffect, useRef, useState} from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import {Text, View} from 'react-native';
import {useConfig} from 'services/web3';
import {mapboxPublicToken} from 'services/config';
import {locationType} from 'screens/TreeSubmission/components/MapMarking/MapMarking.web';

const options = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
};

const RTLAPI = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js';

mapboxgl.accessToken = mapboxPublicToken;
mapboxgl.setRTLTextPlugin(
  RTLAPI,
  null,
  true, // Lazy load the plugin
);

interface MapProps {
  setLocation?: React.Dispatch<React.SetStateAction<locationType>>;
  setAccuracyInMeters?: React.Dispatch<React.SetStateAction<number>>;
}

export default function Map({setLocation, setAccuracyInMeters}: MapProps) {
  const mapContainer = useRef<any>(null);
  const map = useRef<any>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as unknown as HTMLElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom,
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });

    map.current.addControl(geolocate);
    map.current.on('load', () => {
      geolocate.trigger();
      const center = map.current.getCenter();
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

    if (!map.current) return;
    map.current.on('move', () => {
      const center = map.current.getCenter();
      setLng(center.lng);
      setLat(center.lat);
      setZoom(map.current.getZoom().toFixed(2));
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
}
