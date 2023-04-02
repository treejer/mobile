import React from 'react';

import {OpenSettingsButton} from 'screens/TreeSubmission/components/CheckPermissions/CheckPermissions';

export const mockBlockedAllPermissions = [
  {
    name: 'checkPermission.permissions.location',
    status: <OpenSettingsButton caption={'checkPermission.grantNow'} onPress={() => {}} />,
    onPress: () => {},
    icon: 'md-location-outline',
    isExist: true,
    isGranted: false,
  },
  {
    name: 'checkPermission.permissions.camera',
    status: <OpenSettingsButton caption={'checkPermission.grantNow'} onPress={() => {}} />,
    onPress: () => {},
    icon: 'camera-outline',
    isExist: true,
    isGranted: false,
  },
  {
    name: 'checkPermission.permissions.GPS',
    status: <OpenSettingsButton caption={'checkPermission.turnOn'} onPress={() => {}} />,
    onPress: () => {},
    icon: 'locate',
    isExist: true,
    isGranted: false,
  },
];

export const mockCheckingAllPermissions = [
  {
    name: 'checkPermission.permissions.location',
    status: 'checkPermission.dottedChecking',
    onPress: () => {},
    icon: 'md-location-outline',
    isExist: false,
    isGranted: false,
  },
  {
    name: 'checkPermission.permissions.camera',
    status: 'checkPermission.dottedChecking',
    onPress: () => {},
    icon: 'camera-outline',
    isExist: false,
    isGranted: false,
  },
  {
    name: 'checkPermission.permissions.GPS',
    status: 'checkPermission.dottedChecking',
    onPress: () => {},
    icon: 'locate',
    isExist: false,
    isGranted: false,
  },
];

export const mockBlockedOnePermissions = [
  {
    name: 'checkPermission.permissions.location',
    status: <OpenSettingsButton caption={'checkPermission.grantNow'} onPress={() => {}} />,
    onPress: () => {},
    icon: 'md-location-outline',
    isExist: false,
    isGranted: false,
  },
  {
    name: 'checkPermission.permissions.camera',
    status: 'checkPermission.granted',
    onPress: () => {},
    icon: 'camera-outline',
    isExist: true,
    isGranted: true,
  },
  {
    name: 'checkPermission.permissions.GPS',
    status: 'checkPermission.enabled',
    onPress: () => {},
    icon: 'locate',
    isExist: true,
    isGranted: true,
  },
];

export const mockBlockedTwoPermissions = [
  {
    name: 'checkPermission.permissions.location',
    status: <OpenSettingsButton caption={'checkPermission.grantNow'} onPress={() => {}} />,
    onPress: () => {},
    icon: 'md-location-outline',
    isExist: false,
    isGranted: false,
  },
  {
    name: 'checkPermission.permissions.camera',
    status: <OpenSettingsButton caption={'checkPermission.grantNow'} onPress={() => {}} />,
    onPress: () => {},
    icon: 'camera-outline',
    isExist: false,
    isGranted: false,
  },
  {
    name: 'checkPermission.permissions.GPS',
    status: 'checkPermission.enabled',
    onPress: () => {},
    icon: 'locate',
    isExist: true,
    isGranted: true,
  },
];

export const mockGrantedAllPermissions = [
  {
    name: 'checkPermission.permissions.location',
    status: 'checkPermission.granted',
    onPress: () => {},
    icon: 'md-location-outline',
    isExist: true,
    isGranted: true,
  },
  {
    name: 'checkPermission.permissions.camera',
    status: 'checkPermission.granted',
    onPress: () => {},
    icon: 'camera-outline',
    isExist: true,
    isGranted: true,
  },
  {
    name: 'checkPermission.permissions.GPS',
    status: 'checkPermission.enabled',
    onPress: () => {},
    icon: 'locate',
    isExist: true,
    isGranted: true,
  },
];
