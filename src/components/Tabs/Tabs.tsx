import React, {useContext} from 'react';
import {View, ViewStyle} from 'react-native';

export const TabsContext = React.createContext<string | number | null>(null);

export type TabsProps = {
  testID?: string;
  style?: ViewStyle | ViewStyle[];
  tab: string;
  children: JSX.Element | JSX.Element[];
};

export function Tabs(props: TabsProps) {
  const {testID, style, tab, children} = props;

  return (
    <TabsContext.Provider value={tab}>
      <View testID={testID} style={style}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

export const useTabs = () => useContext(TabsContext);
