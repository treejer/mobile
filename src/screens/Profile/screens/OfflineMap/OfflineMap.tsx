import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator, Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Map from 'components/Map';
import {locationPermission} from 'utilities/helpers/permissions';
import Geolocation from 'react-native-geolocation-service';
import {useTranslation} from 'react-i18next';
import {useOfflineMap} from 'ranger-redux/modules/offlineMap/offlineMap';
import globalStyles from 'constants/styles';
import {ScreenTitle} from 'components/ScreenTitle/ScreenTitle';
import Spacer from 'components/Spacer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from 'components/Button';
import {colors} from 'constants/values';
import {AlertMode} from 'utilities/helpers/alert';
import {Routes} from 'navigation/Navigation';
import {offlineMapName} from 'services/config';

export type TestOfflineMapProps = {
  navigation: any;
};

export function OfflineMapScreen(props: TestOfflineMapProps) {
  const {navigation} = props;

  const [zoomLevel, setZoomLevel] = useState(0);
  const [isPermissionBlockedAlertShow, setIsPermissionBlockedAlertShow] = useState(false);
  const {t} = useTranslation();

  const MapBoxGLRef = useRef<MapboxGL.MapView>(null);
  const camera = useRef<MapboxGL.Camera>(null);

  const {packs, downloadingPack, dispatchCreateOfflineMap, loading} = useOfflineMap();

  const initialMapCamera = () => {
    locationPermission()
      .then(() => {
        Geolocation.getCurrentPosition(
          position => {
            if (camera?.current?.setCamera) {
              camera.current?.setCamera({
                centerCoordinate: [position.coords.longitude, position.coords.latitude],
                zoomLevel: 15,
                animationDuration: 1000,
              });
            }
          },
          err => {
            Alert.alert(err.message);
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
          setIsPermissionBlockedAlertShow(true);
        }
      });
  };

  const zoomLevelChanged = async () => {
    if (MapBoxGLRef?.current) {
      setZoomLevel(await MapBoxGLRef?.current?.getZoom());
    }
  };

  const onPressDownloadArea = async () => {
    try {
      const coords = await MapBoxGLRef.current?.getCenter();
      const bounds = await MapBoxGLRef.current?.getVisibleBounds();

      if (coords && bounds) {
        dispatchCreateOfflineMap({
          bounds,
          coords,
          name: offlineMapName(),
        });
      } else {
        toast?.show('offlineMap.sthWrongWithLocation', {type: AlertMode.Error, translate: true});
      }
    } catch (e: any) {
      if (e.message) {
        toast?.show(e.message, {type: AlertMode.Error});
      }
    }
  };

  const renderLoaderModal = () => {
    return (
      <Modal transparent visible={loading}>
        <View style={styles.dowloadModalContainer}>
          <View style={styles.contentContainer}>
            <ActivityIndicator size="large" color={colors.green} style={styles.loader} />
            <Text style={styles.areaName}>{downloadingPack?.areaName}</Text>
          </View>
        </View>
      </Modal>
    );
  };

  const onPressViewAll = useCallback(() => {
    navigation.navigate(Routes.SavedAreas);
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.mainContainer, globalStyles.screenViewBottom, {flex: 1}]}>
      <ScreenTitle title={t('offlineMap.downloadArea')} goBack />
      <View style={styles.container}>
        <Spacer times={2} />
        <View style={styles.mapViewContainer}>
          <Map
            onDidFinishRenderingMapFully={initialMapCamera}
            onWillStartRenderingFrame={zoomLevelChanged}
            ref={MapBoxGLRef}
            style={styles.cont}
          >
            <MapboxGL.UserLocation showsUserHeadingIndicator />
            <MapboxGL.Camera ref={camera} />
          </Map>
          <TouchableOpacity
            onPress={() => {
              initialMapCamera();
            }}
            style={[styles.myLocationIcon]}
            accessible
          >
            <View style={Platform.OS === 'ios' && styles.myLocationIconContainer}>
              <Icon name="my-location" size={24} />
            </View>
          </TouchableOpacity>
        </View>
        {packs?.length === 0 ? (
          <Button
            style={{alignItems: 'center', justifyContent: 'center'}}
            variant="success"
            disabled={zoomLevel < 11}
            onPress={onPressDownloadArea}
            caption={t('offlineMap.download')}
          />
        ) : (
          <View style={styles.bottomBtnsContainer}>
            <Button onPress={onPressViewAll} caption={t('offlineMap.viewAll')} />
            <Button
              variant="success"
              disabled={zoomLevel < 11}
              onPress={onPressDownloadArea}
              caption={t('offlineMap.download')}
            />
          </View>
        )}
      </View>
      {isPermissionBlockedAlertShow && <Text>{t('offlineMap.permissionBlocked')}</Text>}
      {renderLoaderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: colors.khaki,
  },
  cont: {flex: 1},
  mapViewContainer: {
    flex: 1,
    backgroundColor: colors.khaki,
    overflow: 'hidden',
    borderWidth: 2,
    marginVertical: 10,
    borderRadius: 10,
    borderColor: colors.green,
  },
  fakeMarkerCont: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  areaName: {
    fontSize: 16,
    textAlign: 'center',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: colors.khaki,
  },
  dowloadModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  contentContainer: {
    backgroundColor: colors.khaki,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  loader: {
    backgroundColor: colors.khaki,
    borderRadius: 20,
    marginVertical: 20,
  },
  bottomBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  markerImage: {
    position: 'absolute',
    resizeMode: 'contain',
    bottom: 0,
  },
  addSpecies: {
    color: colors.red,
    ...globalStyles.body2,
    textAlign: 'center',
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
    bottom: 25,
  },
  myLocationIconContainer: {
    top: 1.5,
    left: 0.8,
  },
});
