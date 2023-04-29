import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import globalStyles from 'constants/styles';
import Button from 'components/Button';
import {EmptyList} from 'components/Common/EmptyList';
import Spacer from 'components/Spacer';
import {Routes} from 'navigation/Navigation';
import {TreeLife} from 'utilities/helpers/treeInventory';

export type EmptyTreeListProps = {
  testID?: string;
};

export function EmptyTreeList(props: EmptyTreeListProps) {
  const {testID} = props;

  const navigation = useNavigation<any>();
  const {t} = useTranslation();

  const handleNavigateToSelectPlantType = useCallback(() => {
    navigation.navigate(Routes.TreeSubmission_V2);
  }, [navigation]);

  const handleNavigateToNotVerified = useCallback(() => {
    navigation.navigate(Routes.GreenBlock, {
      tabFilter: TreeLife.NotVerified,
    });
  }, [navigation]);

  const handleNavigateToProfile = useCallback(() => {
    navigation.navigate(Routes.MyProfile);
  }, [navigation]);

  return (
    <View testID={testID} style={[globalStyles.fill, globalStyles.justifyContentCenter, globalStyles.alignItemsCenter]}>
      <EmptyList testID="empty-list-cpt" />
      <Spacer times={4} />
      <Button
        testID="start-plant-btn"
        style={styles.btn}
        caption={t('treeInventoryV2.startPlant')}
        variant="cta"
        onPress={handleNavigateToSelectPlantType}
      />
      <Spacer />
      <Button
        testID="visit-notVerified-btn"
        style={styles.btn}
        caption={t('treeInventoryV2.visitNotVerified')}
        variant="cta"
        onPress={handleNavigateToNotVerified}
      />
      <Spacer times={12} />
      <Button
        testID="back-profile-btn"
        caption={t('treeInventoryV2.backProfile')}
        variant="secondary"
        onPress={handleNavigateToProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {width: 192, alignItems: 'center', justifyContent: 'center', paddingVertical: 8},
});
