import React from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';

import Card from 'components/Card';
import {Tree} from 'components/Icons';
import Spacer from 'components/Spacer';
import {colors} from 'constants/values';
import {useSettings} from 'ranger-redux/modules/settings/settings';
import {DraftedJourney} from 'ranger-redux/modules/draftedJourneys/draftedJourneys.reducer';
import {TreeImage} from '../../../assets/icons';

export type DraftItemProps = {
  testID?: string;
  draft: DraftedJourney;
  onPressDraft: () => void;
  onRemoveDraft: () => void;
};

export function DraftItem(props: DraftItemProps) {
  const {testID, draft, onPressDraft, onRemoveDraft} = props;
  const {isNursery} = draft.journey;

  const {locale} = useSettings();

  return (
    <Card testID={testID} style={styles.card}>
      <TouchableOpacity testID={`draft-item-button-${draft.id}`} style={styles.btn} onPress={onPressDraft}>
        {isNursery ? (
          <View testID="nursery-icon" style={styles.treesWrapper}>
            <View style={styles.trees}>
              <Tree color={colors.grayLight} size={16} />
              <Tree color={colors.grayLight} size={16} />
            </View>
            <Tree color={colors.grayLight} size={16} />
          </View>
        ) : (
          <Image testID="tree-image" source={TreeImage} style={styles.treeImage} />
        )}
        <Spacer times={4} />
        <View>
          <Text testID="draft-name" style={styles.draftName}>
            {draft.name}
          </Text>
          <Spacer />
          <Text testID="draft-passage-time" style={styles.passageTime}>
            {moment(draft.updatedAt).locale(locale.toLowerCase()).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity testID={`remove-draft-button-${draft.id}`} onPress={onRemoveDraft}>
        <FAIcon testID="remove-icon" name="trash-alt" color={colors.red} size={18} />
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.khaki,
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 64,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  treeImage: {
    tintColor: colors.grayLight,
    width: 28,
    height: 40,
  },
  treesWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trees: {
    flexDirection: 'row',
  },
  draftName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.tooBlack,
  },
  passageTime: {
    fontSize: 12,
    fontWeight: '300',
    color: colors.tooBlack,
  },
});
