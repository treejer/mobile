import React, {useCallback, useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useTranslation, Trans} from 'react-i18next';
import Fa5Icon from 'react-native-vector-icons/FontAwesome';
import IoIcon from 'react-native-vector-icons/Ionicons';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {TUsePlantTreePermissions} from 'utilities/hooks/usePlantTreePermissions';
import {PermissionItemV2, TPermissionItem} from 'components/CheckingPermissions/PermissionItemV2';
import {isWeb} from 'utilities/helpers/web';
import Card from 'components/Card';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Spacer from 'components/Spacer';
import {Hr} from 'components/Common/Hr';
import {permissionsList} from 'utilities/helpers/permissionsList';
import {SubmissionSettings} from 'components/SubmissionSettings/SubmissionSettings';

const AnimatedCard = isWeb() ? Card : Animated.createAnimatedComponent(Card);

export type TCheckPermissionsProps = {
  testID?: string;
  plantTreePermissions: TUsePlantTreePermissions;
};

export function CheckPermissionsV2(props: TCheckPermissionsProps) {
  const {cantProceed, isChecking, isGranted} = props.plantTreePermissions;

  const [openSettings, setOpenSettings] = useState(false);

  const sharedStylesValue = useSharedValue({height: 94});
  const animationStyles = useAnimatedStyle(() => ({
    height: withTiming(sharedStylesValue.value.height),
  }));

  const {t} = useTranslation();

  const handleToggleSettingsBox = useCallback(() => {
    setOpenSettings(prevState => {
      sharedStylesValue.value = {height: prevState ? 94 : 348};
      return !prevState;
    });
  }, [sharedStylesValue.value]);

  const permissions: TPermissionItem['permission'][] = useMemo(
    () => permissionsList(props.plantTreePermissions),
    [props.plantTreePermissions],
  );

  // TODO:  loading state

  return (
    <AnimatedCard
      testID={props?.testID}
      style={[globalStyles.screenView, styles.container, isGranted ? [{height: 94}, animationStyles] : {}]}
    >
      <View style={[styles.flexRow, styles.boxesPadding]}>
        {!isChecking ? (
          <Fa5Icon
            testID="permission-box-icon"
            style={cantProceed ? styles.warningIcon : styles.checkIcon}
            name={cantProceed ? 'warning' : 'check-circle'}
            size={cantProceed ? 24 : 26}
          />
        ) : (
          <ActivityIndicator testID="permission-box-checking-indicator" color={colors.grayDarker} size="small" />
        )}
        <Spacer />
        <Text testID="permission-box-title" style={[styles.title, isGranted ? styles.greenTextColor : null]}>
          {t(
            isChecking
              ? 'permissionBox.isChecking'
              : cantProceed
              ? 'permissionBox.grantToContinue'
              : 'permissionBox.allGranted',
          )}
        </Text>
      </View>
      <Spacer />
      <Hr />
      {cantProceed || isChecking ? (
        <View testID="permissions-list" style={[styles.flexBetween, styles.boxesPadding]}>
          {permissions.map(permission => (
            <PermissionItemV2 key={permission.name} permission={permission} />
          ))}
        </View>
      ) : (
        <Spacer />
      )}
      {cantProceed ? (
        <View style={styles.boxesPadding}>
          <Text style={styles.guideText}>
            <Trans
              testID="permission-box-guide"
              i18nKey="permissionBox.guide"
              components={{
                Red: <Text style={styles.redTextColor} />,
                Grant: <Text style={styles.greenTextColor} />,
              }}
            />
          </Text>
        </View>
      ) : isGranted ? (
        <View testID="permission-box-plant-settings" style={{paddingHorizontal: 4}}>
          <View style={[styles.flexBetween, {paddingVertical: 0}]}>
            <View style={styles.flexRow}>
              <IoIcon testID="settings-icon" name="settings-outline" size={24} color={colors.grayDarker} />
              <Spacer />
              <Text testID="permission-box-open-settings-text" style={styles.title}>
                {t('permissionBox.submissionSettings')}
              </Text>
            </View>
            <TouchableOpacity testID="toggle-settings-btn" onPress={handleToggleSettingsBox}>
              <IoIcon
                testID="settings-chevron-icon"
                name="chevron-forward"
                size={24}
                color={colors.grayDarker}
                style={{transform: [{rotate: openSettings ? '90deg' : '0deg'}]}}
              />
            </TouchableOpacity>
          </View>
          {isGranted ? (
            <>
              <Spacer />
              <SubmissionSettings
                testID="submission-settings-cpt"
                shadow={false}
                cardStyle={{backgroundColor: colors.khaki}}
              />
            </>
          ) : null}
        </View>
      ) : null}
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  boxesPadding: {
    paddingHorizontal: 12,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  warningIcon: {
    color: colors.red,
  },
  checkIcon: {
    color: colors.green,
  },
  title: {
    color: '#000',
    fontWeight: '500',
    fontSize: 16,
  },
  guideText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grayDarker,
  },
  redTextColor: {
    color: colors.red,
  },
  greenTextColor: {
    color: colors.green,
  },
});
