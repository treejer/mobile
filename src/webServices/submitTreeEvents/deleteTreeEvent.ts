import {NotVerifiedTreeStatus} from 'utilities/helpers/treeInventory';

export type TDeleteTreeEventRes = string;

export type TDeleteTreeEventPayload = {
  event: NotVerifiedTreeStatus;
  id: string;
};

export type TDeleteTreeEventAction = {
  type: string;
  payload: TDeleteTreeEventPayload;
};
