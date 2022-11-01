import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {maxDistanceInKiloMeters} from 'services/config';

import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {calcDistanceInMeters} from 'utilities/helpers/distanceInMeters';
import {checkExif} from 'utilities/helpers/checkExif';
import {TUserLocation} from './usePlantTreePermissions';
import {useConfig} from '../../redux/modules/web3/web3';
import {useSettings} from '../../redux/modules/settings/settings';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();
  const {isMainnet} = useConfig();
  const {checkMetaData} = useSettings();

  return useCallback(
    (
      image64Base: string,
      userLocation: TUserLocation | null,
      successCallback: (imageLocation: TUserLocation) => void,
      imageLocation?: TUserLocation,
      fromGallery?: boolean,
    ) => {
      if (!checkExif(isMainnet, checkMetaData)) {
        successCallback({latitude: 0, longitude: 0});
        return;
      }
      if (imageLocation?.latitude && imageLocation?.longitude) {
        // @here

        if (userLocation) {
          const distance = calcDistanceInMeters(imageLocation, userLocation);

          const distanceInKiloMeters = distance / 1000;

          if (distanceInKiloMeters < maxDistanceInKiloMeters) {
            successCallback(imageLocation);
          } else {
            showAlert({
              title: t('inValidImage.title'),
              mode: AlertMode.Error,
              message: t('inValidImage.longDistance'),
            });
          }
        }
      } else {
        if (fromGallery) {
          showAlert({
            title: t('inValidImage.title'),
            mode: AlertMode.Error,
            message: t('inValidImage.message'),
          });
        } else {
          showAlert({
            title: t('inValidImage.title'),
            mode: AlertMode.Error,
            message: t('inValidImage.hasNoLocation'),
          });
        }
      }
    },
    [t, checkMetaData, isMainnet],
  );
};
