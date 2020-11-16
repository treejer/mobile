import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MapView from 'react-native-maps';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import TreeList from 'components/TreeList';
import {getStaticMapUrl} from 'utilities/helpers';
import {gql} from 'apollo-boost';
import {useQuery} from '@apollo/react-hooks';

interface Props {}

enum GreenBlockView {
  MyCommunity,
  MyTrees,
}

const query = gql`
  query MyCommunityQuery {
    TreeFactory @contract {
      price
    }
  }
`;

function MyCommunity(props: Props) {
  const navigation = useNavigation();
  const [currentView, setCurrentView] = useState(GreenBlockView.MyCommunity);
  const {data, error} = useQuery(query);

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, globalStyles.p1]}>
        <Spacer times={8} />
        <Text style={[globalStyles.h4, globalStyles.textCenter]}>Green Block</Text>
        <Spacer times={4} />
        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
          <Button
            caption="My Community"
            variant={currentView === GreenBlockView.MyCommunity ? 'secondary' : 'primary'}
            onPress={() => setCurrentView(GreenBlockView.MyCommunity)}
            disabled={currentView === GreenBlockView.MyCommunity}
          />
          <Spacer times={2} />
          <Button
            caption="My Trees"
            variant={currentView === GreenBlockView.MyTrees ? 'secondary' : 'primary'}
            onPress={() => setCurrentView(GreenBlockView.MyTrees)}
            disabled={currentView === GreenBlockView.MyTrees}
          />
        </View>
        <Spacer times={6} />
        {currentView === GreenBlockView.MyCommunity ? renderMyCommunity() : renderMyTrees()}
      </View>
    </ScrollView>
  );

  function renderMyCommunity() {
    return (
      <>
        <Text style={[globalStyles.normal, globalStyles.textCenter]}>Trust Score</Text>
        <Spacer times={1} />
        <Text style={[globalStyles.h3, globalStyles.textCenter]}>83/100</Text>
        <Spacer times={6} />

        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
          <Avatar size={56} type="active" />
          <Spacer times={2} />
          <Avatar size={56} type="active" />
          <Spacer times={2} />
          <Avatar size={56} type="inactive" />
          <Spacer times={2} />
          <Avatar size={56} type="inactive" />
        </View>
        <View style={globalStyles.p2}>
          <Card>
            <Text style={[globalStyles.h6, globalStyles.textCenter]}>Green Block Location</Text>
            <Spacer times={6} />
            <Image
              resizeMode="cover"
              style={{
                width: '100%',
                height: 120,
                borderRadius: 10,
              }}
              source={{
                uri: getStaticMapUrl({
                  lat: -122.3088584334867,
                  lon: 47.52468884599355,
                }),
              }}
            />
          </Card>
        </View>
      </>
    );
  }

  function renderMyTrees() {
    return <TreeList onSelect={() => navigation.navigate('TreeDetails')} />;
  }
}

const styles = StyleSheet.create({
  word: {
    marginRight: 10,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderColor: colors.gray,
    borderWidth: 1,
  },
});

export default MyCommunity;
