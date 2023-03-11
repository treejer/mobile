import React, {useCallback, useEffect, useMemo} from 'react';
import {Image as NativeImage} from 'react-native';

import {isWeb} from 'utilities/helpers/web';
import usePlantedTrees from 'utilities/hooks/usePlantedTrees';
import {
  EastWoodMessage,
  MaticLogo,
  NoWalletImage,
  RotateIcon,
  SingUp,
  TreejerIcon,
  Welcome,
  onBoardingOne,
  onBoardingThree,
  onBoardingTwo,
} from '../../../assets/images';
import {MapMarker, TreeImage} from '../../../assets/icons/index';
import {useWalletAccount} from 'ranger-redux/modules/web3/web3';
import {usePagination} from 'utilities/hooks/usePagination';
import planterTreeQuery, {
  PlanterTreesQueryQueryData,
  PlanterTreesQueryQueryPartialData,
} from 'screens/GreenBlock/screens/MyCommunity/graphql/PlanterTreesQuery.graphql';
import {TreeFilter} from 'components/TreeList/TreeFilterItem';

const staticImages = [
  MapMarker,
  TreeImage,
  EastWoodMessage,
  MaticLogo,
  NoWalletImage,
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
  const {persistedData: plantedTrees} = usePagination<
    PlanterTreesQueryQueryData,
    PlanterTreesQueryQueryData.Variables,
    PlanterTreesQueryQueryPartialData.Trees[]
  >(
    planterTreeQuery,
    {
      address: address.toString().toLocaleLowerCase(),
    },
    'trees',
    TreeFilter.Submitted,
  );

  useEffect(() => {
    if (isWeb()) {
      preFetchTreeImagesWeb();
    } else {
      preFetchTreeImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const treeImagesUrl = useMemo(
    () => plantedTrees?.map(tree => tree?.treeSpecsEntity?.imageFs).filter(Boolean),
    [plantedTrees],
  );

  const allImages = useMemo(() => [...staticImages, ...(treeImagesUrl || [])], [treeImagesUrl]);

  const preFetchTreeImages = useCallback(() => {
    treeImagesUrl?.forEach(image => {
      NativeImage.prefetch(String(image));
    });
  }, [treeImagesUrl]);

  const preFetchTreeImagesWeb = useCallback(() => {
    allImages?.forEach(image => {
      const img = new Image();
      img.src = image;
    });
  }, [allImages]);

  if (isWeb()) {
    return <></>;
  } else {
    return (
      <>
        {staticImages.map((img, index) => (
          <NativeImage key={index} source={img} style={{width: 0, height: 0}} />
        ))}
      </>
    );
  }
}

export default PreLoadImage;
