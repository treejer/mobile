import {version} from '../../../package.json';

export function versionToNumber(versionWithDot: string) {
  return Number(versionWithDot.split('-')[0].split('.').join(''));
}

export function checkUpdateVersion(newVersion: string) {
  return versionToNumber(newVersion) > versionToNumber(version);
}

export function checkUserVersion(userVersion: string) {
  return versionToNumber(userVersion) < versionToNumber(version);
}

export function checkPersistedVersion(newVersion: string, oldVersion: string) {
  return versionToNumber(newVersion) > versionToNumber(oldVersion);
}
