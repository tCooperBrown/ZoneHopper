import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
// import { create } from "zustand";
// import { useLineStore } from "../components/upper-bar";
// import { useEffect } from "react";

export default function Home() {
  // const updateDiscoveryVenue = useDiscoveryVenueStore(
  //   (state) => state.updateDiscoveryVenue,
  // );

  return (
    <View style={styles.container}>
      <Link replace href="/primary/primary">
        <Text style={styles.text}>Mock Login</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#000439",
    justifyContent: "center",
    alignItems: "center",
  },
});
