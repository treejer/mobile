import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import MapboxGL from '@rnmapbox/maps';
import {useNavigation} from '@react-navigation/native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

import Map from './Map';
import {Routes} from 'navigation/index';
import {useCurrentJourney} from 'services/currentJourney';
import {maxDistanceInMeters, offlineSubmittingMapName} from 'services/config';
import {colors} from 'constants/values';
import Button from 'components/Button';
import {Check, Times} from 'components/Icons';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';
import {MapDetail} from 'components/Map/MapDetail';
import {TZoomType, MapController} from 'components/Map/MapController';
import {TreeJourney} from 'screens/TreeSubmission/types';
import {useOfflineTrees} from 'utilities/hooks/useOfflineTrees';
import useNetInfoConnected from 'utilities/hooks/useNetInfo';
import {locationPermission} from 'utilities/helpers/permissions';
import {usePersistedPlantedTrees} from 'utilities/hooks/usePlantedTrees';
import {TUserLocation} from 'utilities/hooks/usePlantTreePermissions';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {calcDistanceInMeters} from 'utilities/helpers/distanceInMeters';
import {checkExif} from 'utilities/helpers/checkExif';
import {useConfig} from 'ranger-redux/modules/web3/web3';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {useOfflineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import {SearchBox} from 'components/Map/SearchBox';

interface IMapMarkingProps {
  userLocation?: TUserLocation | null;
  onSubmit?: (location: GeoPosition) => void;
  verifyProfile?: boolean;
  permissionHasLocation?: boolean;
}

export default function MapMarking(props: IMapMarkingProps) {
  const {onSubmit, verifyProfile, permissionHasLocation = false} = props;
  const [accuracyInMeters, setAccuracyInMeters] = useState(0);
  const [loading, setLoading] = useState(!permissionHasLocation);
  const [isInitial, setIsInitial] = useState(true);
  const [location, setLocation] = useState<GeoPosition>();
  const isConnected = useNetInfoConnected();
  const {dispatchAddOfflineTree, dispatchAddOfflineTrees, dispatchAddOfflineUpdateTree} = useOfflineTrees();
  const {journey, setNewJourney, clearJourney} = useCurrentJourney();
  const {t} = useTranslation();

  const {dispatchCreateSubmittingOfflineMap} = useOfflineMap();

  const camera = useRef<MapboxGL.Camera>(null);
  const map = useRef<MapboxGL.MapView>(null);
  const navigation = useNavigation<any>();

  const [isCameraRefVisible, setIsCameraRefVisible] = useState(!!camera?.current);

  const [persistedPlantedTrees] = usePersistedPlantedTrees();
  const {isMainnet} = useConfig();
  const {checkMetaData} = useSettings();

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

  // // generates the alphabets
  // const generateAlphabets = () => {
  //   let alphabetsArray: string[] = [];
  //   for (var x = 1, y; x <= 130; x++) {
  //     y = toLetters(x);
  //     alphabetsArray.push(y);
  //   }
  //   setAlphabets(alphabetsArray);
  // };

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
    if (verifyProfile && location) {
      onSubmit?.(location);
    } else if (journey && journey?.photoLocation && location) {
      const distance = calcDistanceInMeters(
        {
          latitude: location?.coords?.latitude || 0,
          longitude: location?.coords?.longitude || 0,
        },
        {
          latitude: journey?.photoLocation?.latitude,
          longitude: journey?.photoLocation?.longitude,
        },
      );
      const coords = await map.current?.getCenter();
      const bounds = await map.current?.getVisibleBounds();
      if (coords && bounds) {
        dispatchCreateSubmittingOfflineMap({coords, name: offlineSubmittingMapName(), bounds, areaName: ''});
      }

      const newJourney = {
        ...journey,
        location: {
          latitude: location?.coords?.latitude,
          longitude: location?.coords?.longitude,
        },
      };
      if (isConnected) {
        if (
          distance < maxDistanceInMeters ||
          journey.nurseryContinuedUpdatingLocation ||
          !checkExif(isMainnet, checkMetaData)
        ) {
          setNewJourney(newJourney);
          navigation.navigate(Routes.SubmitTree);
        } else {
          showAlert({
            title: t('map.newTree.errTitle'),
            mode: AlertMode.Error,
            message: t('map.newTree.errMessage'),
          });
        }
      } else {
        if (newJourney.isSingle === true) {
          if (distance < maxDistanceInMeters || !checkExif(isMainnet, checkMetaData)) {
            dispatchAddOfflineTree(newJourney);
            clearJourney();
            showAlert({
              title: t('myProfile.attention'),
              message: t('myProfile.offlineTreeAdd'),
              mode: AlertMode.Info,
            });
          } else {
            showAlert({
              title: t('map.newTree.errTitle'),
              mode: AlertMode.Error,
              message: t('map.newTree.errMessage'),
            });
            return;
          }
        } else if (newJourney.isSingle === false && newJourney.nurseryCount) {
          if (distance < maxDistanceInMeters || !checkExif(isMainnet, checkMetaData)) {
            const offlineTrees: TreeJourney[] = [];
            for (let i = 0; i < newJourney.nurseryCount; i++) {
              offlineTrees.push({
                ...newJourney,
                offlineId: (Date.now() + i * 1000).toString(),
              });
            }
            dispatchAddOfflineTrees(offlineTrees);
            clearJourney();
            showAlert({
              title: t('myProfile.attention'),
              message: t('myProfile.offlineNurseryAdd'),
              mode: AlertMode.Info,
            });
          } else {
            showAlert({
              title: t('map.newTree.errTitle'),
              mode: AlertMode.Error,
              message: t('map.newTree.errMessage', {plantType: 'nursery'}),
            });
            return;
          }
        } else if (newJourney?.tree?.treeSpecsEntity?.nursery) {
          if (distance < maxDistanceInMeters || !checkExif(isMainnet, checkMetaData)) {
            const updatedTree = persistedPlantedTrees?.find(item => item.id === journey.treeIdToUpdate);
            dispatchAddOfflineUpdateTree({
              ...newJourney,
              tree: updatedTree,
            });
            showAlert({
              title: t('treeInventory.updateTitle'),
              message: t('submitWhenOnline'),
              mode: AlertMode.Info,
            });
            navigation.goBack(3);
            navigation.navigate(Routes.SelectPlantType);
            navigation.navigate(Routes.MyProfile);
            navigation.navigate(Routes.GreenBlock, {filter: TreeFilter.OfflineUpdate});
            clearJourney();
            return;
          } else {
            showAlert({
              title: t('map.newTree.errTitle'),
              mode: AlertMode.Error,
              message: t('map.newTree.errMessage', {plantType: 'nursery'}),
            });
            return;
          }
        }
        navigation.goBack(3);
        navigation.navigate(Routes.SelectPlantType);
        navigation.navigate(Routes.MyProfile);
        navigation.navigate(Routes.GreenBlock, {filter: TreeFilter.OfflineCreate});
        clearJourney();
      }
    } else {
      if (location) {
        onSubmit?.(location);
      }
    }
  }, [
    journey,
    verifyProfile,
    location,
    onSubmit,
    isConnected,
    dispatchCreateSubmittingOfflineMap,
    isMainnet,
    checkMetaData,
    navigation,
    setNewJourney,
    t,
    clearJourney,
    dispatchAddOfflineTree,
    dispatchAddOfflineTrees,
    persistedPlantedTrees,
    dispatchAddOfflineUpdateTree,
  ]);

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
    <View style={styles.container}>
      <Map map={map} camera={camera} setLocation={setLocation} />

      <SearchBox />
      <View style={[styles.bottom, {width: '100%'}]}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          {hasLocation ? <Button caption="" icon={Times} variant="primary" round onPress={handleDismiss} /> : null}
          {hasLocation ? <MapDetail location={locationDetail} accuracyInMeters={accuracyInMeters} /> : null}
          {hasLocation ? <Button caption="" icon={Check} variant="success" round onPress={handleSubmit} /> : null}
        </View>
        {hasLocation ? <MapController onZoom={handleZoom} onLocate={initialMapCamera} /> : null}
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
