import * as React from "react";
import { StyleSheet, View, Text, SafeAreaView, Picker } from "react-native";
import Steps from "./Steps";

function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>
          Create{"\n"}
          Redeemable{"\n"}
          Trees
        </Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.stepContainer}>
          <Steps />
          <View style={styles.stepContentContainer}>
            <Text style={styles.stepHeader}>Create Voucher</Text>
            <Picker
              selectedValue="tree"
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue, itemIndex) => { }}
            >
              <Picker.Item label="SELECT TREES" value="tree" />
            </Picker>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F0',
  },
  heading: {
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  headingText: {
    fontSize: 28,
    lineHeight: 35,
    fontWeight: '600',
    color: '#51575E',
    fontFamily: 'Montserrat-Bold'
  },
  contentContainer: {
    marginTop: 30,
    marginHorizontal: 30
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepContentContainer: {
    paddingBottom: 20,
    paddingLeft: 15
  },
  stepHeader: {
    fontFamily: 'Montserrat-Light',
  }
})

export default HomeScreen;
