import React, {useCallback, useEffect, useMemo} from 'react';
import {Image as NativeImage} from 'react-native';
import {useWalletAccount} from 'services/web3';
import {isWeb} from 'utilities/helpers/web';
import usePlantedTrees from 'utilities/hooks/usePlantedTrees';
import {
  EastWoodMessage,
  MaticLogo,
  NoWalletImage,
  RinkebyLogo,
  RotateIcon,
  SingUp,
  TreejerIcon,
  Welcome,
  onBoardingOne,
  onBoardingThree,
  onBoardingTwo,
} from '../../../assets/images/index';
import {MapMarker, TreeImage} from '../../../assets/icons/index';

const icons = [MapMarker, TreeImage];
const images = [
  EastWoodMessage,
  MaticLogo,
  NoWalletImage,
  RinkebyLogo,
  RotateIcon,
  SingUp,
  TreejerIcon,
  Welcome,
  onBoardingOne,
  onBoardingThree,
  onBoardingTwo,
];

function PreLoadImage() {
  const address = useWalletAccount();
  const {plantedTrees} = usePlantedTrees(address);

  useEffect(() => {
    if (isWeb()) {
      preFetchTreeImagesWeb();
    } else {
      preFetchTreeImages();
    }
  }, [plantedTrees]);

  const treeImagesUrl = useMemo(() => plantedTrees?.map(tree => tree.treeSpecsEntity.imageFs), [plantedTrees]);

  const allImages = useMemo(() => [...images, ...icons, ...(treeImagesUrl || [])], [plantedTrees, treeImagesUrl]);

  console.log('====================================');
  console.log(allImages, '<==== all images');
  console.log('====================================');

  const preFetchTreeImages = useCallback(() => {
    allImages?.forEach(async image => {
      if (image) {
        await NativeImage.prefetch(image);
      }
    });
  }, [plantedTrees]);

  const preFetchTreeImagesWeb = useCallback(() => {
    allImages?.forEach(image => {
      if (image) {
        const img = new Image();
        img.src = image;
      }
    });
  }, [plantedTrees]);

  return <></>;
}

export default PreLoadImage;

// images.forEach(async image => {
//   if (image) {
//     await NativeImage.prefetch(image);
//   }
// });
// icons.forEach(async icon => {
//   if (icon) {
//     await NativeImage.prefetch(icon);
//   }
// });
// const treeImagesUrl = plantedTrees?.map(tree => tree.treeSpecsEntity.imageFs);
