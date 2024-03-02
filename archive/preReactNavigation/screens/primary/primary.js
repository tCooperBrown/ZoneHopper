import { Button, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import UpperBar from "./upper-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import PrimaryStations from "./primary-stations";

export default function Primary() {
  return (
    <>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <UpperBar />
          <PrimaryStations />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: {},
  container: {
    backgroundColor: "#000439",
    height: "100%",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
