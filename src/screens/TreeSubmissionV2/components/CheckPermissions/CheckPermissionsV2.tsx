import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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

const AnimatedView = isWeb() ? View : Animated.createAnimatedComponent(View);

export type TCheckPermissionsProps = {
  testID?: string;
  plantTreePermissions: TUsePlantTreePermissions;
  lockSettings: boolean;
  onUnLock: () => void;
};

export function CheckPermissionsV2(props: TCheckPermissionsProps) {
  const {testID, lockSettings, onUnLock, plantTreePermissions} = props;
  const {cantProceed, isChecking, isGranted} = plantTreePermissions;

  const [openSettings, setOpenSettings] = useState(false);

  const sharedStylesValue = useSharedValue({height: 94});
  const animationStyles = useAnimatedStyle(() => ({
    height: withTiming(sharedStylesValue.value.height),
  }));

  useEffect(() => {
    if (lockSettings) {
      sharedStylesValue.value = {height: 94};
    }
  }, [lockSettings]);

  const {t} = useTranslation();

  const handleToggleSettingsBox = useCallback(() => {
    setOpenSettings(prevState => {
      sharedStylesValue.value = {height: prevState ? 94 : Platform.OS === 'android' ? 152 : 158};
      return !prevState;
    });
  }, [sharedStylesValue.value]);

  const permissions: TPermissionItem['permission'][] = useMemo(
    () => permissionsList(props.plantTreePermissions),
    [props.plantTreePermissions],
  );

  // TODO:  loading state

  return (
    <Card style={styles.boxShadow}>
      <AnimatedView
        testID={testID}
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
              <TouchableOpacity
                testID="toggle-settings-btn"
                onPress={lockSettings ? onUnLock : handleToggleSettingsBox}
              >
                <IoIcon
                  testID="settings-chevron-icon"
                  name={lockSettings ? 'lock-closed' : 'chevron-forward'}
                  size={24}
                  color={colors.grayDarker}
                  style={!lockSettings ? {transform: [{rotate: openSettings ? '90deg' : '0deg'}]} : undefined}
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
      </AnimatedView>
    </Card>
  );
}

const styles = StyleSheet.create({
  boxShadow: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  container: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderRadius: 10,
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
