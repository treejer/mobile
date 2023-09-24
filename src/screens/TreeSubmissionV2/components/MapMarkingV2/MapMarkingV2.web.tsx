import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {GeoCoordinates, GeoPosition} from 'react-native-geolocation-service';

import {colors} from 'constants/values';
import Map from 'screens/TreeSubmissionV2/components/Map/Map';
import Button from 'components/Button';
import {Check, Times} from 'components/Icons';
import {MapDetail} from 'components/Map/MapDetail';
import {TZoomType, MapController} from 'components/Map/MapController';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {SearchBox} from 'components/Map/SearchBox';
import {useCurrentJourney} from 'ranger-redux/modules/currentJourney/currentJourney.reducer';
import {getCurrentPositionAsyncWeb} from 'utilities/hooks/usePlantTreePermissions.web';
import {BrowserName, useBrowserName} from 'utilities/hooks/useBrowserName';

export type locationType = {
  lng: number;
  lat: number;
};
interface MapMarkingProps {
  userLocation?: TUserLocation | null;
  permissionHasLocation?: boolean;
  onSubmit?: (location: Partial<GeoPosition>) => void;
  verifyProfile?: boolean;
}
export function MapMarkingV2(props: MapMarkingProps) {
  const {onSubmit, userLocation, verifyProfile, permissionHasLocation = false} = props;

  const map = useRef<any>(null);

  const {journey, dispatchSelectTreeLocation} = useCurrentJourney();
  const [accuracyInMeters, setAccuracyInMeters] = useState(0);
  const [location, setLocation] = useState<locationType | null>(null);
  const [verifyUserLocation, setVerifyUserLocation] = useState<TUserLocation | null>(null);
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  const isConnected = useNetInfoConnected();
  const browserName = useBrowserName();

  const handleLocate = useCallback(
    (coordinates: number[], zoom?: number, duration?: number) => {
      map.current.flyTo({
        // * 1: longitude, 2: latitude
        center: coordinates,
        zoom: zoom || 12,
        duration: duration || 1000,
      });
    },
    [map],
  );

  const handleGetCurrentUserLocation = useCallback(
    async (locateOfterSuccess?: boolean) => {
      try {
        const {latitude, longitude} = await getCurrentPositionAsyncWeb(t);
        setVerifyUserLocation({longitude, latitude});
        if (locateOfterSuccess) {
          handleLocate([longitude, latitude], 16, 2000);
        }
      } catch (error: any) {
        showAlert({
          title: error?.code ? t('checkPermission.error.siteSettings') : t('checkPermission.error.unknownError'),
          message: error?.code
            ? browserName === BrowserName.Safari
              ? t(`checkPermission.error.GPS.${error?.code}`, {message: error?.message})
              : t(`checkPermission.error.${error?.code}`, {message: error?.message})
            : t('checkPermission.error.unknownError'),
          mode: AlertMode.Info,
        });
      }
    },
    [t, browserName, handleLocate],
  );

  useEffect(() => {
    if (verifyProfile) {
      (async () => {
        await handleGetCurrentUserLocation();
      })();
    }
  }, []);

  const handleZoom = useCallback(
    async (zoomType: TZoomType = TZoomType.In) => {
      const zoomLevel = map?.current?.getZoom();
      if (zoomLevel) {
        const zoomTo = +zoomLevel + (zoomType === TZoomType.In ? 0.5 : -0.5);
        map?.current?.zoomTo(zoomTo);
      }
    },
    [map],
  );

  // * 1: longitude, 2: latitude
  const handleLocateToUserLocation = useCallback(async () => {
    if (verifyProfile) {
      if (verifyUserLocation?.longitude && verifyUserLocation.latitude) {
        handleLocate([verifyUserLocation?.longitude, verifyUserLocation?.latitude], 16, 2000);
      } else {
        await handleGetCurrentUserLocation(true);
      }
    } else {
      if (userLocation?.latitude && userLocation?.longitude) {
        handleLocate([userLocation?.longitude, userLocation?.latitude], 16, 2000);
      }
    }
  }, [userLocation, handleLocate, verifyUserLocation, verifyProfile, handleGetCurrentUserLocation]);

  const handleDismiss = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSubmit = useCallback(() => {
    if (location) {
      const submittedLocation = {
        latitude: location.lat,
        longitude: location.lng,
      };
      if (verifyProfile) {
        onSubmit?.({
          coords: submittedLocation as GeoCoordinates,
        });
      } else if (journey) {
        if (isConnected) {
          dispatchSelectTreeLocation({location: submittedLocation});
        } else {
          showAlert({message: `${t('offlineMap.notSupported')}`, mode: AlertMode.Error});
        }
      } else {
        if (location) {
          const coords = {
            latitude: location.lat,
            longitude: location.lng,
            accuracy: accuracyInMeters,
            heading: 0,
            altitude: 0,
            speed: 0,
            altitudeAccuracy: 0,
          };
          onSubmit?.({
            coords,
            timestamp: Date.now(),
          });
        }
      }
    }
  }, [accuracyInMeters, isConnected, journey, location, onSubmit, t, verifyProfile, dispatchSelectTreeLocation]);

  const locationDetail = useMemo(
    () => ({
      latitude: location?.lat || 0,
      longitude: location?.lng || 0,
    }),
    [location],
  );

  return (
    <View style={styles.container}>
      <Map setLocation={setLocation} setAccuracyInMeters={setAccuracyInMeters} map={map} />

      {location ? (
        <SearchBox onLocate={handleLocate} userLocation={verifyProfile ? verifyUserLocation : userLocation} />
      ) : null}
      <View style={[styles.bottom, {width: '100%'}]}>
        {location && (
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Button caption="" icon={Times} variant="primary" round onPress={handleDismiss} />
            <MapDetail location={locationDetail} accuracyInMeters={accuracyInMeters} />
            <Button caption="" icon={Check} variant="success" round onPress={handleSubmit} />
            <MapController onZoom={handleZoom} onLocate={handleLocateToUserLocation} />
          </View>
        )}
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
    paddingBottom: 40,
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
