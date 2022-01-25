import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

export interface RadioButtonProps {
  items: {key: string; text: string}[];
  onChange: (key: string) => void;
  defaultValue?: string;
}

const RadioButton = (props: RadioButtonProps) => {
  const {items, onChange, defaultValue = null} = props;
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (value !== null) {
      onChange(value);
    }
  }, [value, onChange]);

  return (
    <View style={[styles.container, {width: '100%', marginBottom: 0}]}>
      {items.map(res => {
        return (
          <TouchableOpacity
            key={res.key}
            style={styles.container}
            onPress={() => {
              setValue(res.key);
            }}
          >
            <Text style={styles.radioText}>{res.text}</Text>
            <View style={styles.radioCircle}>{value === res.key && <View style={styles.selectedRb} />}</View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioText: {
    marginRight: 25,
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  radioCircle: {
    height: 25,
    width: 25,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgb(102, 178, 138)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    backgroundColor: 'rgb(102, 178, 138)',
  },
  result: {
    marginTop: 20,
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#F3FBFE',
  },
});

export default RadioButton;
