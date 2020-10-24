import React, {useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {ChevronLeft} from 'components/Icons';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import {getStaticMapUrl} from 'utilities/helpers';
import Button from 'components/Button';
import {colors} from 'constants/values';

interface Props {}

function TreeDetails(props: Props) {
  const navigation = useNavigation();

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
        <Text style={[globalStyles.h3, globalStyles.textCenter]}>10047</Text>
        <Spacer times={8} />

        <View style={globalStyles.p2}>
          <Card>
            <Button
              variant="success"
              caption="Update"
              style={styles.updateButton}
              textStyle={globalStyles.textCenter}
            />
            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Location</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>Lordegan, Iran</Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>GPS Coordinates</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>41.40, 2.17</Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Generated O2</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>12.4352</Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Last Update</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>23 July, 2020</Text>
            <Spacer times={6} />

            <Text style={[globalStyles.h6, globalStyles.textCenter, styles.header]}>Born</Text>
            <Text style={[globalStyles.h5, globalStyles.textCenter]}>2018</Text>
            <Spacer times={6} />

            <View
              style={{
                marginHorizontal: -20,
                marginBottom: -23,
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
                  uri: getStaticMapUrl({
                    lat: -122.3088584334867,
                    lon: 47.52468884599355,
                  }),
                }}
              />
            </View>
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
