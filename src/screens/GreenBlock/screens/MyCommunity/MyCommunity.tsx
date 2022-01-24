import globalStyles from 'constants/styles';

import React, {useEffect, useState} from 'react';
import {Text, View, SafeAreaView} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import TreeList from 'components/TreeList';
import {GreenBlockRouteParamList} from 'types';
import MyCommunitySection from 'components/MyCommunitySection';

interface Props {
  route: RouteProp<GreenBlockRouteParamList, 'MyCommunity'>;
}
enum GreenBlockView {
  MyCommunity,
  MyTrees,
}

function MyCommunity({route}: Props) {
  const [currentView, setCurrentView] = useState(
    route.params?.shouldNavigateToTreeDetails ? GreenBlockView.MyTrees : GreenBlockView.MyCommunity,
  );

  useEffect(() => {
    if (route.params?.shouldNavigateToTreeDetails) {
      setCurrentView(route.params?.shouldNavigateToTreeDetails ? GreenBlockView.MyTrees : GreenBlockView.MyCommunity);
    }
  }, [route.params]);

  return (
    <SafeAreaView
      style={[globalStyles.mt3, globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, globalStyles.p1]}
    >
      <Text style={[globalStyles.h4, globalStyles.textCenter]}>Green Block</Text>
      <Spacer times={4} />
      <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
        <Button
          caption="My Community"
          variant={selectBasedOnView(GreenBlockView.MyCommunity, 'primary', 'secondary')}
          onPress={() => setCurrentView(GreenBlockView.MyCommunity)}
          disabled={currentView === GreenBlockView.MyCommunity}
        />
        <Spacer times={2} />
        <Button
          caption="My Trees"
          variant={selectBasedOnView(GreenBlockView.MyCommunity, 'secondary', 'primary')}
          onPress={() => setCurrentView(GreenBlockView.MyTrees)}
          disabled={currentView === GreenBlockView.MyTrees}
        />
      </View>
      <Spacer times={6} />
      {renderContent()}
    </SafeAreaView>
  );

  function renderContent() {
    return currentView === GreenBlockView.MyCommunity ? <MyCommunitySection /> : <TreeList route={route} />;
  }

  function selectBasedOnView<T1, T2>(view: GreenBlockView, valueIfTrue: T1, valueIfFalse: T2): T1 | T2 {
    return currentView === view ? valueIfTrue : valueIfFalse;
  }
}

export default MyCommunity;
