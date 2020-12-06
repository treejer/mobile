import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

import Button from 'components/Button';
import Spacer from 'components/Spacer';
import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import TreeList from 'components/TreeList';
import {useApolloClient, useQuery} from '@apollo/react-hooks';
import {useWalletAccount} from 'services/web3';
import {getStaticMapUrl} from 'utilities/helpers';

import treesQuery, {TreesQueryQueryData} from './graphql/TreesQuery.graphql';
import greenBlockIdQuery from './graphql/GreenBlockIdQuery.graphql';
import planterQuery from './graphql/GreenBlockPlanterQuery.graphql';
import greenBlockDetailsQuery from './graphql/GreenBlockDetailsQuery.graphql';

interface Props {}

enum GreenBlockView {
  MyCommunity,
  MyTrees,
}

const usePlanters = (greenBlockId: string) => {
  const client = useApolloClient();
  const [planters, setPlanters] = useState<string[] | undefined>();

  useEffect(() => {
    if (client && greenBlockId) {
      (async () => {
        let shouldStop = false;
        const result: string[] = [];
        for (let i = 0; i < 5 && !shouldStop; i++) {
          try {
            const {data} = await client.query({
              query: planterQuery,
              variables: {
                userId: String(i),
                greenBlockId,
              },
            });

            result.push(data.GBFactory.planter);
          } catch {
            shouldStop = true;
          }
        }

        setPlanters(result);
      })();
    }
  }, [client, greenBlockId]);

  return {data: planters};
};

function MyCommunity(props: Props) {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const [currentView, setCurrentView] = useState(GreenBlockView.MyCommunity);
  const account = useWalletAccount();

  const mapWidth = dimensions.width - 100;

  const accountAddress = account?.address;
  // const accountAddress = '0x9ec0A4472fF40cd9beE54A26a268c29C9dF3872F'; // account?.address

  const greenBlockIdQueryResult = useQuery(greenBlockIdQuery, {
    variables: {
      address: accountAddress,
    },
    fetchPolicy: 'cache-first',
    skip: !account,
    onError(error) {
      const addressNotPresent = error.message.includes('Address not present');

      if (addressNotPresent) {
        // TODO: Replace screen
        navigation.navigate('CreateGreenBlock');
      }
    },
  });

  const treesQueryResult = useQuery<TreesQueryQueryData>(treesQuery, {
    variables: {
      address: accountAddress,
      limit: 10,
    },
    fetchPolicy: 'cache-first',
    skip: !account,
  });

  // const greenBlockId = greenBlockIdQueryResult.data?.GBFactory.greenBlockId;
  const greenBlockId = '3';

  const greenBlockDetailsQueryResult = useQuery(greenBlockDetailsQuery, {
    variables: {
      greenBlockId,
    },
    fetchPolicy: 'cache-first',
    skip: !greenBlockId,
  });

  const {data: planters} = usePlanters(greenBlockId);

  const greenBlockData = greenBlockDetailsQueryResult.data?.GBFactory.greenBlock;
  const coordinates = JSON.parse(greenBlockData?.coordinates ?? '[]');

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
        {/*
        <Text style={[globalStyles.normal, globalStyles.textCenter]}>Trust Score</Text>
        <Spacer times={1} />
        <Text style={[globalStyles.h3, globalStyles.textCenter]}>83/100</Text>
        <Spacer times={6} />
        */}

        <View style={[globalStyles.horizontalStack, globalStyles.alignItemsCenter, globalStyles.justifyContentCenter]}>
          {!planters && (
            <ShimmerPlaceholder
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
              }}
            />
          )}
          {planters?.map(planter => (
            <React.Fragment key={planter}>
              <Spacer times={1} />
              <Avatar size={56} type="active" address={planter} />
              <Spacer times={1} />
            </React.Fragment>
          ))}
        </View>

        <View style={globalStyles.p2}>
          <Card>
            <Text style={[globalStyles.h6, globalStyles.textCenter]}>Green Block Location</Text>
            <Spacer times={6} />
            {coordinates.length === 0 ? (
              <ShimmerPlaceholder style={styles.mapImage} shimmerColors={['#ebebeb', '#f1f1f1', '#ebebeb']} />
            ) : (
              <Image
                resizeMode="cover"
                style={styles.mapImage}
                source={{
                  uri: getStaticMapUrl({
                    path: {
                      coordinates,
                    },
                    width: mapWidth,
                    height: mapWidth / 2,
                  }),
                }}
              />
            )}
          </Card>
        </View>
      </>
    );
  }

  function renderMyTrees() {
    return (
      <TreeList
        loading={treesQueryResult.loading}
        trees={treesQueryResult.data?.trees.trees.data}
        onSelect={tree => navigation.navigate('TreeDetails', {tree})}
      />
    );
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
  mapImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
  },
});

export default MyCommunity;
