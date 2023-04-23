import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';

import {colors} from 'constants/values';
import globalStyles from 'constants/styles';
import Spacer from 'components/Spacer';
import {TreeItemV2} from 'components/TreeListV2/TreeItemV2';
import {useTreeUpdateInterval} from 'utilities/hooks/useTreeUpdateInterval';
import {treeDetail} from 'ranger-redux/modules/__test__/currentJourney/mock';

export type TreeListV2Props = {
  testID?: string;
};

export function TreeListV2(props: TreeListV2Props) {
  const {testID} = props;

  const [withDetail, setWithDetail] = useState(false);

  const treeUpdateInterval = useTreeUpdateInterval();

  return (
    <View testID={testID} style={styles.container}>
      <View testID="select-tree-item-size" style={styles.sizeContainer}>
        <TouchableOpacity testID="small-size-button" onPress={() => setWithDetail(false)}>
          <Fa5Icon testID="small-size-icon" name="th" color={!withDetail ? colors.green : colors.grayLight} size={36} />
        </TouchableOpacity>
        <Spacer />
        <TouchableOpacity testID="big-size-button" onPress={() => setWithDetail(true)}>
          <Fa5Icon
            testID="big-size-icon"
            name="th-large"
            color={withDetail ? colors.green : colors.grayLight}
            size={36}
          />
        </TouchableOpacity>
      </View>
      <Spacer times={4} />
      <View>
        <TreeItemV2
          testID="tree-item-v2-cpt"
          withDetail={withDetail}
          treeUpdateInterval={treeUpdateInterval}
          tree={treeDetail as any}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: globalStyles.p1.padding,
  },
  sizeContainer: {
    ...globalStyles.flexRow,
    justifyContent: 'flex-end',
  },
});
