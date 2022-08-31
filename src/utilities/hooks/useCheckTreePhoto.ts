import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {maxDistanceInKiloMeters} from 'services/config';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {calcDistanceInMeters} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from './usePlantTreePermissions';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();

  return useCallback(
    (
      image64Base: string,
      userLocation: TUserLocation | null,
      successCallback: (imageLocation: TUserLocation) => void,
      imageLocation?: TUserLocation,
      fromGallery?: boolean,
    ) => {
      if (imageLocation?.latitude && imageLocation?.longitude) {
        // @here

        if (userLocation) {
          const distance = calcDistanceInMeters(imageLocation, userLocation);

          const distanceInKiloMeters = distance / 1000;

          console.log({userLocation, imageLocation, distance, distanceInKiloMeters});

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
    [t],
  );
};
