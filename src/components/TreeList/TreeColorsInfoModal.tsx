import React from 'react';
import {Modal, Text, TouchableWithoutFeedback, View} from 'react-native';
import {colors} from 'constants/values';
import {treeColorTypes} from 'utilities/helpers/tree';
import {useTranslation} from 'react-i18next';
import {TreeImage} from 'components/TreeList/TreeImage';

export type TreeColorsInfoModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function TreeColorsInfoModal(props: TreeColorsInfoModalProps) {
  const {visible, onClose} = props;

  const {t} = useTranslation();

  return (
    <Modal visible={visible} transparent style={{flex: 1}} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{flex: 1, backgroundColor: colors.grayOpacity, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{padding: 20, overflow: 'hidden', width: 280}}>
            <View style={{backgroundColor: colors.khaki, padding: 12, borderRadius: 12}}>
              {Object.values(treeColorTypes).map(type => (
                <View
                  key={type.title}
                  style={{
                    borderColor: colors.khakiDark,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TreeImage treeUpdateInterval={1} tint color={type.color} size={48} />
                  <Text style={{color: colors.grayDarker}}>{t(type.title)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
