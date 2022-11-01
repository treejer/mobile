import MapboxGL from '@rnmapbox/maps';
// import Logger from '@rnmapbox/maps/javascript/utils/Logger';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapKit from 'components/Map/Map';
import {colors} from 'constants/values';
import globalStyles, {fontBold} from 'constants/styles';
import {locationPermission} from 'utilities/helpers/permissions';
import Geolocation from 'react-native-geolocation-service';

// Logger.setLogCallback(log => {
//   const {message} = log;
//   // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
//   if (
//     message.match('Request failed due to a permanent error: Canceled') ||
//     message.match('Request failed due to a permanent error: Socket Closed')
//   ) {
//     return true;
//   }
//   return false;
// });

interface IMapProps {
  map?: any;
  camera?: any;
  setLocation?: any;
  setAccuracyInMeters?: any;
}

export default function Map({map, camera, setLocation}: IMapProps) {
  const onChangeRegionComplete = updatedRegion => {
    const {geometry} = updatedRegion;
    setLocation({
      mocked: false,
      timestamp: Date.now(),
      coords: {
        latitude: geometry.coordinates[1],
        longitude: geometry.coordinates[0],
        // accuracy: number,
        // altitude: number | null,
        // heading: number | null,
        // speed: number | null,
        // altitudeAccuracy: number | null,
      },
    });
  };

  const initialMapCamera = () => {
    locationPermission()
      .then(() => {
        Geolocation.getCurrentPosition(
          position => {
            if (camera?.current?.setCamera) {
              camera.current.setCamera({
                centerCoordinate: [position.coords.longitude, position.coords.latitude],
                zoomLevel: 15,
                animationDuration: 1000,
              });
            }
          },
          err => {
            alert(err.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            accuracy: {
              android: 'high',
              ios: 'bestForNavigation',
            },
          },
        );
      })
      .catch(err => {
        console.log({
          logType: 'other',
          message: 'Error while checking location permission',
          logStack: JSON.stringify(err),
        });
      });
  };

  return (
    <View style={styles.container}>
      <MapKit
        onDidFinishRenderingMapFully={initialMapCamera}
        ref={map}
        style={styles.container}
        onRegionDidChange={onChangeRegionComplete}
      >
        <>
          <MapboxGL.UserLocation visible showsUserHeadingIndicator />
          <MapboxGL.Camera ref={camera} />
        </>
      </MapKit>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.khaki,
  },
  fakeMarkerCont: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerImage: {
    position: 'absolute',
    resizeMode: 'contain',
    bottom: 0,
  },
  markerContainer: {
    width: 30,
    height: 43,
  },
  markerText: {
    width: 30,
    height: 43,
    color: colors.khaki,
    ...globalStyles.body2,
    ...fontBold,
    textAlign: 'center',
    paddingTop: 4,
  },
  loader: {
    position: 'absolute',
    bottom: 67,
  },
  activeMarkerLocation: {
    position: 'absolute',
    bottom: 67,
    color: colors.khaki,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const polyline = {lineWidth: 2, lineColor: colors.grayDarker};
