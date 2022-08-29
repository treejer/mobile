import {useTranslation} from 'react-i18next';
import {AlertMode, showAlert} from 'utilities/helpers/alert';
import {calcDistanceInMeters} from 'utilities/helpers/distanceInMeters';
import {TUserLocation} from './usePlantTreePermissions';

export const useCheckTreePhoto = () => {
  const {t} = useTranslation();

  return (
    image64Base: string,
    userLocation: TUserLocation | null,
    successCallback: (imageLocation: TUserLocation) => void,
    imageLocation?: TUserLocation,
    fromGallery?: boolean,
  ) => {
    if (imageLocation?.latitude && imageLocation?.longitude) {
      // @here
      let maxDistance = 200;

      if (userLocation) {
        const distance = calcDistanceInMeters(imageLocation, userLocation);

        const distanceInKiloMeters = distance / 1000;

        console.log({userLocation, imageLocation, distance, distanceInKiloMeters});

        if (distanceInKiloMeters < maxDistance) {
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
  };
};
