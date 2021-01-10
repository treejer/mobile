import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Share, useWindowDimensions, RefreshControl} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import * as Linking from 'expo-linking';

import globalStyles from 'constants/styles';
import {colors} from 'constants/values';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import TreeList from 'components/TreeList';
import IconButton from 'components/IconButton';
import {Plus} from 'components/Icons';
import {useApolloClient, useQuery} from '@apollo/react-hooks';
import {useGBFactory, useWalletAccount} from 'services/web3';
import {getStaticMapUrl} from 'utilities/helpers';

import treesQuery, {TreesQueryQueryData} from './graphql/TreesQuery.graphql';
import greenBlockIdQuery from './graphql/GreenBlockIdQuery.graphql';
import planterQuery from './graphql/GreenBlockPlanterQuery.graphql';
import greenBlockDetailsQuery from './graphql/GreenBlockDetailsQuery.graphql';
import {NetworkStatus} from 'apollo-boost';

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

function MyCommunity(_: Props) {
  const navigation = useNavigation();
  const dimensions = useWindowDimensions();
  const [currentView, setCurrentView] = useState(GreenBlockView.MyCommunity);
  const account = useWalletAccount();
  const mapWidth = dimensions.width - 100;

  const accountAddress = account?.address;

  const greenBlockIdQueryResult = useQuery(greenBlockIdQuery, {
    variables: {
      address: accountAddress,
    },
    fetchPolicy: 'cache-first',
    skip: !account,
    onCompleted(data) {
      if (data?.GBFactory?.greenBlockId == 0) {
        navigation.dispatch(state => {
          const routes = [{name: 'CreateGreenBlock'}];

          return CommonActions.reset({
            ...state,
            routes,
            index: state.index,
            stale: state.stale as any,
          });
        });
      }
    },
    onError(error) {
      console.warn('Error while fetching green block id', error);
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

  const greenBlockId = greenBlockIdQueryResult.data?.GBFactory.greenBlockId;
  // const greenBlockId = '3';

  const greenBlockDetailsQueryResult = useQuery(greenBlockDetailsQuery, {
    variables: {
      greenBlockId,
    },
    fetchPolicy: 'cache-first',
    skip: !greenBlockId,
  });

  const onRefetch = () => {
    treesQueryResult.refetch();
  };

  const {data: planters} = usePlanters(greenBlockId);

  const greenBlockData = greenBlockDetailsQueryResult.data?.GBFactory.greenBlock;
  const coordinates = JSON.parse(greenBlockData?.coordinates ?? '[]');
  const refetching = treesQueryResult.networkStatus === NetworkStatus.refetch;

  return (
    <ScrollView
      style={[globalStyles.screenView, globalStyles.fill, globalStyles.mt3]}
      refreshControl={<RefreshControl refreshing={refetching} onRefresh={onRefetch} />}
    >
      <View style={[globalStyles.screenView, globalStyles.fill, globalStyles.safeArea, globalStyles.p1]}>
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
          {(planters?.length < 5 || true) && (
            <>
              <Spacer times={1} />
              <IconButton
                size={56}
                variant="primary"
                icon={Plus}
                props={{color: colors.grayDarker}}
                onPress={() => {
                  Share.share({
                    message: Linking.makeUrl(`invite/green-block/${greenBlockId}`),
                  });
                }}
              />
              <Spacer times={1} />
            </>
          )}
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
