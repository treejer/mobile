import {getHttpDownloadUrl} from 'utilities/helpers/IPFS';
import {currentTimestamp} from 'utilities/helpers/date';
import {TreeDetailQueryQueryData} from 'screens/GreenBlock/screens/TreeDetails/graphql/TreeDetailQuery.graphql';
import {TreeJourney} from 'screens/TreeSubmission/types';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SubmitTreeData {
  export interface Options {
    photoUploadHash: string;
    tree: TreeDetailQueryQueryData.Tree;
    journey: TreeJourney;
  }

  export interface NewTreeOptions {
    photoUploadHash: string;
    journey: TreeJourney;
  }

  export interface JSONDataUpdate {
    image: string;
    image_hash: string;
    created_at: string;
  }

  export interface Location {
    latitude: string;
    longitude: string;
  }

  export interface JSONData {
    location: Location;
    updates: JSONDataUpdate[];
    locations?: Location[];
    name?: string;
    description?: string;
    external_url?: string;
    image_ipfs_hash?: string;
    symbol?: string;
    symbol_ipfs_hash?: string;
    animation_url?: string;
    diameter?: string;
    attributes?: string;
    image?: string;
    nursery?: string;
  }
}

export function updateTreeJSON(options: SubmitTreeData.Options) {
  const {photoUploadHash, tree, journey} = options;

  const birthDay = currentTimestamp();

  const updateSpec: SubmitTreeData.JSONDataUpdate = {
    image: getHttpDownloadUrl(photoUploadHash),
    image_hash: photoUploadHash,
    created_at: birthDay?.toString(),
  };

  const treeSpecJson = tree?.treeSpecsEntity;
  let updates: SubmitTreeData.JSONDataUpdate[];

  if (typeof treeSpecJson?.updates != 'undefined' && treeSpecJson?.updates != '') {
    updates = JSON.parse(treeSpecJson?.updates);
    updates.push(updateSpec);
  } else {
    updates = [updateSpec];
  }

  const jsonData: SubmitTreeData.JSONData = {
    location: {
      latitude: tree?.treeSpecsEntity?.latitude?.toString(),
      longitude: tree?.treeSpecsEntity?.longitude?.toString(),
    },
    updates,
  };
  if (tree?.treeSpecsEntity?.name) {
    jsonData.name = tree?.treeSpecsEntity?.name;
  }
  if (tree?.treeSpecsEntity?.description) {
    jsonData.description = tree?.treeSpecsEntity?.description;
  }
  if (tree?.treeSpecsEntity?.externalUrl) {
    jsonData.external_url = tree?.treeSpecsEntity?.externalUrl;
  }
  if (tree?.treeSpecsEntity?.imageHash) {
    jsonData.image_ipfs_hash = tree?.treeSpecsEntity?.imageHash;
  }
  if (tree?.treeSpecsEntity?.symbolFs) {
    jsonData.symbol = tree?.treeSpecsEntity?.symbolFs;
  }
  if (tree?.treeSpecsEntity?.symbolHash) {
    jsonData.symbol_ipfs_hash = tree?.treeSpecsEntity?.symbolHash;
  }
  if (tree?.treeSpecsEntity?.animationUrl) {
    jsonData.animation_url = tree?.treeSpecsEntity?.animationUrl;
  }
  if (tree?.treeSpecsEntity?.diameter) {
    jsonData.diameter = tree?.treeSpecsEntity?.diameter?.toString();
  }
  if (tree?.treeSpecsEntity?.attributes) {
    jsonData.attributes = JSON.parse(tree?.treeSpecsEntity?.attributes);
  }

  if (treeSpecJson.nursery === 'true' && journey.location?.longitude && journey.location?.latitude) {
    jsonData.location = {
      latitude: Math.trunc(journey.location.latitude * Math.pow(10, 6))?.toString(),
      longitude: Math.trunc(journey.location.longitude * Math.pow(10, 6))?.toString(),
    };
    const prevLocation = {
      latitude: tree?.treeSpecsEntity?.latitude?.toString(),
      longitude: tree?.treeSpecsEntity?.longitude?.toString(),
    };
    jsonData.locations = treeSpecJson.locations?.length
      ? [...(JSON.parse(treeSpecJson.locations) || []), prevLocation]
      : [prevLocation];
  }

  console.log(jsonData, 'updateTreeJSON jsonData');

  return jsonData;
}

export function assignedTreeJSON(options: SubmitTreeData.Options) {
  const {photoUploadHash, tree, journey} = options;

  const birthDay = currentTimestamp();

  const updateSpec: SubmitTreeData.JSONDataUpdate = {
    image: getHttpDownloadUrl(photoUploadHash),
    image_hash: photoUploadHash,
    created_at: birthDay?.toString(),
  };

  const treeSpecJson = tree?.treeSpecsEntity;
  let updates: SubmitTreeData.JSONDataUpdate[];

  if (typeof treeSpecJson?.updates != 'undefined' && treeSpecJson?.updates != '') {
    updates = JSON.parse(treeSpecJson?.updates);
    updates.push(updateSpec);
  } else {
    updates = [updateSpec];
  }

  const jsonData: SubmitTreeData.JSONData = {
    location: {
      latitude: Math.trunc(journey.location.latitude * Math.pow(10, 6))?.toString(),
      longitude: Math.trunc(journey.location.longitude * Math.pow(10, 6))?.toString(),
    },
    updates,
  };
  if (tree?.treeSpecsEntity?.imageFs) {
    jsonData.image = tree?.treeSpecsEntity?.imageFs?.toString();
  }
  if (tree?.treeSpecsEntity?.image_ipfs_hash) {
    jsonData.image_ipfs_hash = tree?.treeSpecsEntity?.image_ipfs_hash?.toString();
  }

  console.log(jsonData, 'assignedTreeJSON jsonData');

  return jsonData;
}

export function newTreeJSON(options: SubmitTreeData.NewTreeOptions) {
  const {journey, photoUploadHash} = options;

  const birthDay = currentTimestamp();

  const jsonData: SubmitTreeData.JSONData = {
    location: {
      latitude: Math.trunc(journey.location.latitude * Math.pow(10, 6))?.toString(),
      longitude: Math.trunc(journey.location.longitude * Math.pow(10, 6))?.toString(),
    },
    updates: [
      {
        image: getHttpDownloadUrl(photoUploadHash),
        image_hash: photoUploadHash,
        created_at: birthDay?.toString(),
      },
    ],
  };
  if (journey.isSingle === false) {
    jsonData.nursery = 'true';
  }

  console.log(jsonData, 'newTreeJSON jsonData');

  return jsonData;
}

export function canUpdateTreeLocation(journey: TreeJourney, isNursery: boolean) {
  return journey?.tree?.treeSpecsEntity?.locations?.length === 0 && isNursery;
}
