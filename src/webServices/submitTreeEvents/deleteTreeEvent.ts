export enum DeleteTreeEvents {
  Plant = 'Plant',
  Update = 'Update',
  Assigned = 'Assigned',
}

export type TDeleteTreeEventRes = string;

export type TDeleteTreeEventPayload = {
  event: DeleteTreeEvents;
  id: string;
};

export type TDeleteTreeEventAction = {
  type: string;
  payload: TDeleteTreeEventPayload;
};
