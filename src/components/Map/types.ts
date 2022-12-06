export type TPlace = {
  center: number[];
  geometry: {
    coordinates: number[];
  };
  id: string;
  place_name: string;
  relevance: number;
  text;
  string;
  type: string;
};

export type TPlaceForm = {
  search: string;
};
