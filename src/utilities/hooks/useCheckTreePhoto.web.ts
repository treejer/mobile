import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import exifr from 'exifr';

import {maxDistanceInKiloMeters} from 'services/config';
import {checkExif} from 'utilities/helpers/checkExif';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {calcDistanceInMeters, TPoint} from 'utilities/helpers/distanceInMeters';
import {BrowserPlatform, useBrowserPlatform} from 'utilities/hooks/useBrowserPlatform';
import {useConfig} from 'ranger-redux/modules/web3/web3';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {TUserLocation} from './usePlantTreePermissions';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();
  const {isMainnet} = useConfig();
  const {checkMetaData} = useSettings();
  const browserPlatform = useBrowserPlatform();

  return useCallback(
    async (
      image64Base: string,
      userLocation: TUserLocation,
      successCallback: (imageLocation?: TUserLocation) => void,
      imageLocation: TUserLocation,
    ) => {
      try {
        if (browserPlatform === BrowserPlatform.iOS || !checkMetaData) {
          successCallback({latitude: 0, longitude: 0});
          return;
        }
        const {latitude, longitude, ...exif} = await exifr.parse(image64Base);
        if (latitude > 0 && longitude > 0) {
          if (userLocation) {
            const imageCoords: TPoint = {
              latitude,
              longitude,
            };
            const distance = calcDistanceInMeters(imageCoords, userLocation);
            const distanceInKiloMeters = distance / 1000;
            if (distanceInKiloMeters < maxDistanceInKiloMeters) {
              successCallback(imageCoords);
            } else {
              showAlert({
                title: t('inValidImage.title'),
                mode: AlertMode.Error,
                message: t('inValidImage.longDistance'),
              });
            }
          } else {
            showAlert({
              title: t('inValidImage.title'),
              mode: AlertMode.Error,
              message: t('inValidImage.hasNoLocation'),
            });
          }
        } else {
          showAlert({
            title: t('inValidImage.title'),
            mode: AlertMode.Error,
            message: t('inValidImage.hasNoLocation'),
          });
        }
      } catch (error) {
        showAlert({
          title: t('inValidImage.title'),
          mode: AlertMode.Error,
          message: t('inValidImage.hasNoLocation'),
        });
      }
    },
    [browserPlatform, t, checkMetaData, isMainnet],
  );
};
