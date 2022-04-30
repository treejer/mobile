import React from 'react';
import Button from 'components/Button';
import {useTranslation} from 'react-i18next';

export enum TreeFilter {
  All = 'All',
  Submitted = 'Submitted',
  Temp = 'Not Verified',
  OfflineCreate = 'Planted Offline',
  OfflineUpdate = 'Updated Offline',
}

export interface TreeFilterItem {
  caption: TreeFilter;
  offline?: boolean;
}

export type TreeFilterProps = {
  item: TreeFilterItem;
  currentFilter: TreeFilterItem | null;
  onPress: (item: TreeFilterItem) => void;
};

export function TreeFilterItem(props: TreeFilterProps) {
  const {item, currentFilter, onPress} = props;

  const {caption} = item;
  const variant = currentFilter?.caption === caption ? 'secondary' : 'primary';

  const {t} = useTranslation();

  return (
    <Button
      caption={t(caption)}
      variant={variant}
      style={{marginHorizontal: 4, marginBottom: 8}}
      textStyle={{fontSize: 12}}
      onPress={() => onPress(item)}
    />
  );
}
