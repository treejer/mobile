import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {useNavigation} from '@react-navigation/native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

import Map from 'screens/TreeSubmission/components/MapMarking/Map';
import {offlineSubmittingMapName} from 'services/config';
import {colors} from 'constants/values';
import Button from 'components/Button';
import {Check, Times} from 'components/Icons';
import {MapDetail} from 'components/Map/MapDetail';
import {TZoomType, MapController} from 'components/Map/MapController';
import {locationPermission} from 'utilities/helpers/permissions';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {useOfflineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import {SearchBox} from 'components/Map/SearchBox';
import {useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {Routes} from 'navigation/Navigation';

export type MapMarkingProps = {
  testID?: string;
  userLocation?: TUserLocation | null;
  permissionHasLocation?: boolean;
};

export function MapMarkingV2(props: MapMarkingProps) {
  const {permissionHasLocation = false, userLocation, testID} = props;
  const [accuracyInMeters, setAccuracyInMeters] = useState(0);
  const [loading, setLoading] = useState(!permissionHasLocation);
  const [isInitial, setIsInitial] = useState(true);
  const [location, setLocation] = useState<GeoPosition>();

  const {dispatchSelectTreeLocation} = useCurrentJourney();
  const {dispatchCreateSubmittingOfflineMap} = useOfflineMap();

  const camera = useRef<MapboxGL.Camera>(null);
  const map = useRef<MapboxGL.MapView>(null);
  const navigation = useNavigation<any>();

  const [isCameraRefVisible, setIsCameraRefVisible] = useState(!!camera?.current);

  useEffect(() => {
    if (!!camera.current && !isCameraRefVisible) {
      setIsCameraRefVisible(true);
    }
  }, [camera, isCameraRefVisible]);

  const handleZoom = useCallback(
    async (zoomType: TZoomType = TZoomType.In) => {
      const zoomLevel = await map?.current?.getZoom();
      if (zoomLevel) {
        const zoomTo = +zoomLevel + (zoomType === TZoomType.In ? 0.5 : -0.5);
        camera?.current?.zoomTo(zoomTo);
      }
    },
    [map, camera],
  );

  // recenter the marker to the current coordinates
  const onPressMyLocationIcon = useCallback(
    (position: any) => {
      if (isInitial) {
        setIsInitial(false);
        return;
      }
      if (isCameraRefVisible && camera?.current?.setCamera) {
        setIsInitial(false);
        camera.current.setCamera({
          centerCoordinate: [position.coords.longitude, position.coords.latitude],
          zoomLevel: 18,
          animationDuration: 1000,
        });
      }
    },
    [isCameraRefVisible, isInitial],
  );

  useEffect(() => {
    if (isInitial && location) {
      onPressMyLocationIcon(location);
    }
  }, [isCameraRefVisible, isInitial, location, onPressMyLocationIcon]);

  // only the first time marker will follow the user's current location by default
  const onUpdateUserLocation = useCallback(
    (userLocation: any) => {
      if (isInitial && userLocation) {
        onPressMyLocationIcon(userLocation);
      }
    },
    [isInitial, onPressMyLocationIcon],
  );

  const handleDismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(async () => {
    const coords = await map.current?.getCenter();
    const bounds = await map.current?.getVisibleBounds();

    if (coords && bounds) {
      dispatchCreateSubmittingOfflineMap({coords, name: offlineSubmittingMapName(), bounds, areaName: ''});
    }

    if (location?.coords) {
      const submittedLocation = {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
      };

      dispatchSelectTreeLocation({location: submittedLocation});
      // navigation.navigate(Routes.SubmitTree_V2);
    }
  }, [dispatchCreateSubmittingOfflineMap, dispatchSelectTreeLocation, location]);

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      position => {
        onUpdateUserLocation(position);
        setAccuracyInMeters(position.coords.accuracy);
        setLoading(false);
      },
      err => {
        console.log(err, 'err in watch position');
      },
      {
        enableHighAccuracy: true,
        accuracy: {
          android: 'high',
          ios: 'bestForNavigation',
        },
        interval: 1000,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, [onUpdateUserLocation]);

  // getting current position of the user with high accuracy
  const updateCurrentPosition = useCallback(async () => {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        position => {
          setAccuracyInMeters(position.coords.accuracy);
          onUpdateUserLocation(position);
          setLocation(position);
          resolve(position);
        },
        err => {
          console.log(err, 'err inside updateCurrentPosition');
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
    });
  }, [onUpdateUserLocation]);

  const checkPermission = useCallback(async () => {
    try {
      await locationPermission();
      MapboxGL.setTelemetryEnabled(false);
      await updateCurrentPosition();
      return true;
    } catch (err: any) {
      if (err?.message == 'blocked') {
        console.log('blocked');
      } else if (err?.message == 'denied') {
        console.log('denied');
      } else {
        console.log(err, 'err inside checkPermission');
      }
      return false;
    }
  }, [updateCurrentPosition]);

  useEffect(() => {
    (async function () {
      await checkPermission();
    })();
  }, [checkPermission]);

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
            showAlert({
              message: err.message,
              mode: AlertMode.Error,
            });
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
        if (err.message === 'blocked') {
          console.log('blocked');
        }
      });
  };

  const handleLocate = useCallback(
    (coordinates: number[]) => {
      camera?.current?.setCamera({
        centerCoordinate: coordinates,
        zoomLevel: 15,
        animationDuration: 1000,
      });
    },
    [camera],
  );

  const hasLocation = useMemo(
    () => location?.coords?.latitude && location?.coords?.longitude && accuracyInMeters && !loading,
    [accuracyInMeters, loading, location?.coords?.latitude, location?.coords?.longitude],
  );

  const locationDetail = useMemo(
    () => ({
      latitude: location?.coords.latitude || 0,
      longitude: location?.coords.longitude || 0,
    }),
    [location],
  );

  return (
    <View testID={testID} style={styles.container}>
      <Map testID="map-cpt" map={map} camera={camera} setLocation={setLocation} />

      {hasLocation ? <SearchBox testID="search-box-cpt" onLocate={handleLocate} userLocation={userLocation} /> : null}
      <View style={[styles.bottom, {width: '100%'}]}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          {hasLocation ? (
            <Button testID="dismiss-btn" caption="" icon={Times} variant="primary" round onPress={handleDismiss} />
          ) : null}
          {hasLocation ? (
            <MapDetail testID="map-detail-cpt" location={locationDetail} accuracyInMeters={accuracyInMeters} />
          ) : null}
          {hasLocation ? (
            <Button testID="submit-btn" caption="" icon={Check} variant="success" round onPress={handleSubmit} />
          ) : null}
        </View>
        {hasLocation ? (
          <MapController testID="map-controller-cpt" onZoom={handleZoom} onLocate={initialMapCamera} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.khaki,
  },
  bottom: {
    position: 'absolute',
    paddingHorizontal: 20,
    paddingBottom: 30,
    left: 0,
    bottom: 0,
    right: 0,
  },
  myLocationIcon: {
    width: 45,
    height: 45,
    backgroundColor: colors.khaki,
    position: 'absolute',
    borderRadius: 100,
    right: 0,
    marginHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.gray,
    bottom: 120,
  },
});
