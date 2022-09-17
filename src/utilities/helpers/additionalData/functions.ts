import {getBrand, getManufacturer, getModel, getSystemName, getSystemVersion} from 'react-native-device-info';
import RNFS from 'react-native-fs';
import {version} from '../../../../package.json';
import {
  deleteAllAdditionalData,
  getSchemaNameFromType,
  importForm,
  importMetadata,
} from 'utilities/helpers/additionalData/additionalData';
import {MULTI, OFF_SITE, ON_SITE, SAMPLE, SINGLE} from 'utilities/helpers/inventoryConstants';
import {accessTypes, elementsType} from './constants';
import {IAdditionalDataImport, IFormData} from './interfaces';

export const sortByField = (fieldName: string, arrayData: any) => {
  return arrayData.sort((a: any, b: any) => {
    return a[`${fieldName}`] - b[`${fieldName}`];
  });
};

export const filterFormByTreeAndRegistrationType = (
  formData: any,
  treeType: string,
  registrationType: string,
  isSampleTree: boolean = false,
) => {
  if (treeType && treeType.toLowerCase() !== 'all') {
    if (isSampleTree === true && registrationType === ON_SITE && treeType === MULTI) {
      treeType = SAMPLE;
    }
    for (let i in formData) {
      let elements: any = formData[i].elements;
      elements = elements.filter((element: any) => element.treeType.includes(treeType));
      formData[i].elements = elements;
    }
  }
  if (
    registrationType &&
    registrationType.toLowerCase() !== 'all' &&
    (!isSampleTree || (isSampleTree === true && registrationType === ON_SITE && treeType === MULTI))
  ) {
    for (let i in formData) {
      let elements: any = formData[i].elements;
      elements = elements.filter((element: any) => element.registrationType.includes(registrationType));
      formData[i].elements = elements;
    }
  }
  return formData;
};

export const getFormattedMetadata = (additionalDetails: any) => {
  let formattedDetails: any = {public: {}, private: {}, app: {}};

  if ((additionalDetails || Array.isArray(additionalDetails)) && additionalDetails.length > 0) {
    for (let detail of additionalDetails) {
      formattedDetails[`${detail.accessType}`][`${detail.key}`] = detail.value;
    }
  }
  return formattedDetails;
};

export const getFormattedAdditionalDetails = (metadata: any) => {
  let additionalDetails: any = [];

  if (metadata && Object.keys(metadata).length > 0) {
    for (const dataKey of Object.keys(metadata)) {
      if (!metadata[dataKey] || Object.keys(metadata[dataKey]).length === 0) {
        continue;
      } else if (dataKey === accessTypes.APP && metadata[dataKey]?.appVersion) {
        additionalDetails.push({
          key: 'appVersion',
          value: metadata[dataKey].appVersion,
          accessType: accessTypes.APP,
        });
        continue;
      }
      const accessType = dataKey === 'public' ? accessTypes.PUBLIC : accessTypes.PRIVATE;

      for (const [key, value] of Object.entries(metadata[dataKey])) {
        if (typeof value === 'string') {
          additionalDetails.push({
            key,
            value,
            accessType,
          });
        }
      }
    }
  }

  return additionalDetails;
};

const isAdditionalData = (object: any): object is IAdditionalDataImport => {
  return 'formData' in object && 'metadata' in object;
};

const getDeviceDetails = async () => {
  return {
    deviceBrand: getBrand(),
    deviceModel: getModel(),
    deviceManufacturer: await getManufacturer(),
    deviceSystemName: getSystemName(),
    deviceSystemVersion: getSystemVersion(),
  };
};

interface IGetAppMetadata {
  data: any;
  isSampleTree?: boolean;
}

// used to support schema 11 migration
export const appAdditionalDataForAPISchema11 = ({data, isSampleTree = false}: IGetAppMetadata) => {
  const appAdditionalDetails: any = {};

  if (data.treeType === SINGLE || isSampleTree) {
    appAdditionalDetails['speciesHeight'] = data.specieHeight;
    appAdditionalDetails['speciesDiameter'] = data.specieDiameter;

    if (data.tagId) {
      appAdditionalDetails['tagId'] = data.tagId;
    }
  }

  // adding dates to additional details
  if (data.registrationDate) {
    appAdditionalDetails['registrationDate'] = data.registrationDate;
  }
  if (data.plantationDate || data.plantation_date) {
    appAdditionalDetails['plantationDate'] = data.plantationDate || data.plantation_date;
  }

  // adding species to additional details
  if (!isSampleTree) {
    if (data.polygons.length === 0) {
      return;
    }
    let coords = data.polygons[0].coordinates;

    appAdditionalDetails['species'] = data.species;
    appAdditionalDetails['deviceLocation'] = [coords[0].latitude, coords[0].longitude];
    if (data.projectId) {
      appAdditionalDetails['projectId'] = data.projectId;
    }
  } else {
    appAdditionalDetails['species'] = [
      {
        id: data.specieId,
        aliases: data.specieId === 'unknown' ? 'Unknown' : data.specieName,
        treeCount: 1,
      },
    ];
    appAdditionalDetails['deviceLocation'] = [data.deviceLatitude, data.deviceLongitude];
  }

  appAdditionalDetails['appVersion'] = version;

  return appAdditionalDetails;
};

export const basicAppAdditionalDataForAPI = ({data, isSampleTree = false}: IGetAppMetadata) => {
  let appAdditionalDetails: any = {};

  // adding dates to additional details
  if (data.registrationDate) {
    appAdditionalDetails['registrationDate'] = data.registrationDate;
  }

  // adding species to additional details
  if (!isSampleTree) {
    if (data.polygons.length === 0) {
      return;
    }
    let coords = data.polygons[0].coordinates;

    if (data.locateTree !== OFF_SITE) {
      appAdditionalDetails['deviceLocation'] = {
        coordinates: [coords[0].longitude, coords[0].latitude],
        type: 'Point',
      };
    }
  } else {
    appAdditionalDetails['deviceLocation'] = {
      coordinates: [data.deviceLongitude, data.deviceLatitude],
      type: 'Point',
    };
  }
  appAdditionalDetails['appVersion'] = version;

  return {
    ...appAdditionalDetails,
    deviceBrand: getBrand(),
    deviceModel: getModel(),
    deviceSystemName: getSystemName(),
    deviceSystemVersion: getSystemVersion(),
  };
};

export const additionalDataForUI = ({data, isSampleTree = false}: IGetAppMetadata) => {
  const appAdditionalDetails: any[] = [];

  if (!isSampleTree) {
    let coords = data.polygons[0].coordinates;

    if (data.locateTree !== OFF_SITE) {
      appAdditionalDetails.push({
        key: 'deviceLocation',
        value: `${coords[0].latitude}, ${coords[0].longitude}`,
        accessType: accessTypes.APP,
      });
    }
  } else {
    appAdditionalDetails.push({
      key: 'deviceLocation',
      value: `${data?.deviceLatitude}, ${data?.deviceLongitude}`,
      accessType: accessTypes.APP,
    });
  }
  return appAdditionalDetails;
};

export const appAdditionalDataForAPI = async ({data, isSampleTree = false}: IGetAppMetadata) => {
  let appAdditionalDetails: any = basicAppAdditionalDataForAPI({data, isSampleTree});

  appAdditionalDetails = {
    ...appAdditionalDetails,
    deviceManufacturer: await getManufacturer(),
  };

  return appAdditionalDetails;
};
