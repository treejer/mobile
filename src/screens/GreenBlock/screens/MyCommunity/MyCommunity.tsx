import globalStyles from 'constants/styles';
import {colors} from 'constants/values';

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, Share, useWindowDimensions, RefreshControl} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import ShimmerPlaceholder from 'components/ShimmerPlaceholder';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import TreeList from 'components/TreeList';
import IconButton from 'components/IconButton';
import {Plus} from 'components/Icons';
import {useApolloClient, useQuery} from '@apollo/react-hooks';
import {useWalletAccount} from 'services/web3';
import {getStaticMapUrl} from 'utilities/helpers';
import {NetworkStatus} from 'apollo-boost';

import treesQuery, {TreesQueryQueryData} from './graphql/TreesQuery.graphql';
import greenBlockIdQuery from './graphql/GreenBlockIdQuery.graphql';
import planterQuery from './graphql/GreenBlockPlanterQuery.graphql';
import greenBlockDetailsQuery from './graphql/GreenBlockDetailsQuery.graphql';

interface Props {}

enum GreenBlockView {
  MyCommunity,
  MyTrees,
}

const HTTPS_BASE_URL = 'https://ranger.treejer.com';

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
  const [currentView, setCurrentView] = useState(
    _.route.params && _.route.params.goTree ? GreenBlockView.MyTrees : GreenBlockView.MyCommunity,
  );

  const account = useWalletAccount();
  const mapWidth = dimensions.width - 100;

  const accountAddress = account?.address;

  const greenBlockIdQueryResult = useQuery(greenBlockIdQuery, {
    variables: {
      address: accountAddress,
    },
    fetchPolicy: 'network-only',
    skip: !account,
    onCompleted(data) {
      const greenBlockId = data?.GBFactory?.greenBlockId ?? 0;
      if (Number(greenBlockId) === 0) {
        navigation.dispatch(state =>
          CommonActions.reset({
            ...state,
            routes: [{name: 'CreateGreenBlock'}],
            index: state.index,
            stale: state.stale as any,
          }),
        );
      }
    },
    onError(error) {
      console.warn('Error while fetching green block id', error);
    },
  });

  const treesQueryResult = useQuery<TreesQueryQueryData>(treesQuery, {
    variables: {
      address: accountAddress,
      limit: 50,
    },
    fetchPolicy: 'cache-first',
    skip: !account,
  });

  const greenBlockId = greenBlockIdQueryResult.data?.GBFactory.greenBlockId;

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

  useEffect(() => {
    if (_.route.params && _.route.params.goTree) {
      setCurrentView(_.route.params && _.route.params.goTree ? GreenBlockView.MyTrees : GreenBlockView.MyCommunity);
      onRefetch();
    }
  }, [_.route.params]);

  const {data: planters} = usePlanters(greenBlockId);

  const greenBlockData = greenBlockDetailsQueryResult.data?.GBFactory.greenBlock;
  let coordinates: any[];
  try {
    coordinates = JSON.parse(greenBlockData?.coordinates ?? '[]');
  } catch {
    coordinates = [];
  }

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
      </View>
    </ScrollView>
  );

  function renderContent() {
    return currentView === GreenBlockView.MyCommunity ? renderMyCommunity() : renderMyTrees();
  }

  function selectBasedOnView<T1 extends any, T2 extends any>(
    view: GreenBlockView,
    valueIfTrue: T1,
    valueIfFalse: T2,
  ): T1 | T2 {
    return currentView === view ? valueIfTrue : valueIfFalse;
  }

  function renderMyCommunity() {
    const mapImageMarkup =
      coordinates.length === 0 ? (
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
      );

    return (
      <>
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
                    message: `${HTTPS_BASE_URL}/invite/green-block/${greenBlockId}`,
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
            {mapImageMarkup}
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
