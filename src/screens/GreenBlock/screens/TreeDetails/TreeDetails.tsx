import React from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Linking} from 'react-native';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {ChevronLeft} from 'components/Icons';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import {getStaticMapUrl} from 'utilities/helpers';
import Button from 'components/Button';
import {TreesQueryQueryData} from '../MyCommunity/graphql/TreesQuery.graphql';
import {GreenBlockRouteParamList} from '../../GreenBlock';
import {useWalletAccount} from 'services/web3';

interface RouteParams {
  tree: TreesQueryQueryData.TreesTreesData;
}

interface Props {}

function TreeDetails(_: Props) {
  const navigation = useNavigation();
  const {
    params: {tree},
  } = useRoute<RouteProp<GreenBlockRouteParamList, 'TreeDetails'>>();

  const mapImageUrl = getStaticMapUrl({
    markers: [
      {
        coordinate: {
          lat: Number(tree.latitude),
          lng: Number(tree.longitude),
        },
      },
    ],
    width: 600,
    height: 300,
  });

  return (
    <ScrollView style={[globalStyles.screenView, globalStyles.fill]}>
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea]}>
        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.p3]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft />
          </TouchableOpacity>
          <View style={globalStyles.fill} />
          <Avatar size={40} type="active" />
        </View>

        <Image style={[styles.treeImage]} source={require('../../../../../assets/icons/tree.png')} />
        <Text style={[globalStyles.h3, globalStyles.textCenter]}>{tree.treeId}</Text>
        {/* Tree id */}
        <Spacer times={8} />

        <View style={globalStyles.p2}>
          <Card>
            <Button
              variant="success"
              caption="Update"
              style={styles.updateButton}
              textStyle={globalStyles.textCenter}
            />
            {/* <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Location</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>Lordegan, Iran</Text>
            <Spacer times={6} /> */}

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>GPS Coordinates</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>
              {tree.latitude}, {tree.longitude}
            </Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Height</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>{tree.height} cm</Text>
            {/* TBD */}
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Last Update</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>
              {new Date(tree.updatedAt).toLocaleDateString()}
            </Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Born</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>{new Date(tree.createdAt).getFullYear()}</Text>
            <Spacer times={6} />

            <TouchableOpacity
              style={{
                marginHorizontal: -20,
                marginBottom: -23,
              }}
              onPress={() => {
                Linking.openURL(
                  `https://www.google.com/maps?q=loc:${encodeURIComponent(
                    `${tree.latitude},${tree.longitude}`,
                  )}&zoom=6`,
                );
              }}
            >
              <Image
                resizeMode="cover"
                style={{
                  alignSelf: 'center',
                  width: '99%',
                  height: 200,
                  borderBottomLeftRadius: 15,
                  borderBottomRightRadius: 15,
                }}
                source={{
                  uri: mapImageUrl,
                }}
              />
            </TouchableOpacity>
          </Card>
        </View>
        <Spacer times={8} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#757575',
  },
  updateButton: {
    position: 'absolute',
    top: -45,
    left: '50%',
    marginLeft: -50,
    width: 100,
  },
  treeImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
});

export default TreeDetails;
