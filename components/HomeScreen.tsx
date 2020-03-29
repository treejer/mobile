import * as React from "react";
import { StyleSheet, View, Text, SafeAreaView, Picker } from "react-native";
import Steps from "./Steps";
import NumberInput from "./NumberInput";
import Button from "./Button";

function HomeScreen() {
  const currentStep = 1;
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
          <Steps step={1} currentStep={currentStep} />
          <View style={styles.stepContentContainer}>
            <Text style={styles.stepHeader}>Create Voucher</Text>
            <View style={styles.inputBox}>
              <Text>SELECT TREES</Text>
            </View>
            <Text style={styles.stepHeader}>Trees per voucher</Text>
            <NumberInput />

            <Text style={styles.stepHeader}>Total vouchers to distribute</Text>
            <NumberInput />

            <Button caption="NEXT" />
          </View>
        </View>
        <View style={styles.stepContainer}>
          <Steps step={2} currentStep={currentStep} />
          <View style={styles.stepContentContainer}>
            <Text style={styles.stepHeader}>Approve to Collect Trees for Creating Vouchers</Text>
          </View>
        </View>
        <View style={styles.stepContainer}>
          <Steps step={3} currentStep={currentStep} renderDash={false} />
          <View style={styles.stepContentContainer}>
            <Text style={styles.stepHeader}>Approve to Pay Service Fee</Text>
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
    paddingBottom: 40,
    paddingLeft: 15,
    flex: 1,
  },
  stepHeader: {
    fontFamily: 'Montserrat-Light',
  },
  inputBox: { borderRadius: 7, borderColor: '#777', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 20, marginVertical: 20, maxWidth: 250 }
})

export default HomeScreen;
