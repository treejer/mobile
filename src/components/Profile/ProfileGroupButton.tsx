import React from 'react';
import {StyleSheet, View} from 'react-native';

export type TProfileGroupButton = {
  isVerified?: boolean;
  direction?: 'row' | 'column';
  children: JSX.Element | JSX.Element[] | null;
};

export function ProfileGroupButton(props: TProfileGroupButton) {
  const {direction = 'row', children} = props;

  return <View style={[styles.container, styles[direction]]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
