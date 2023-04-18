import React from 'react';
import {View, ViewStyle} from 'react-native';

import {useTabs} from 'components/Tabs/Tabs';
import {RenderIf} from 'components/Common/RenderIf';

export type TabProps = {
  testID?: string;
  style?: ViewStyle | ViewStyle[];
  tab: string | number;
  children: JSX.Element | JSX.Element[];
};

export function Tab(props: TabProps) {
  const {testID, tab, style, children} = props;

  const currentTab = useTabs();

  return (
    <RenderIf condition={tab === currentTab}>
      <View testID={testID} style={style}>
        {children}
      </View>
    </RenderIf>
  );
}
