import { StyleSheet, View, Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import UpperBar from "./upper-bar";
import PrimaryStations from "./primary-stations";

const PrimaryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <UpperBar />
      <PrimaryStations />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000439",
    height: "100%",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});
export default PrimaryScreen;
