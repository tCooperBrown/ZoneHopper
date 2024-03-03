import { Link } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { create } from "zustand";
import { getDiscoveryVenues } from "../getDiscoveryVenues";
import { useLineStore } from "../components/upper-bar";
import { useStationsStore } from "../components/primary-stations";

export const useDiscoveryVenueStore = create((set) => ({
  discoveryVenue: [],
  updateDiscoveryVenue: (newDiscoveryVenue) =>
    set({ discoveryVenue: newDiscoveryVenue }),
}));

export default function Home() {
  const updateDiscoveryVenue = useDiscoveryVenueStore(
    (state) => state.updateDiscoveryVenue,
  );
  const activeLine = useLineStore((state) => state.line);
  const stations = useStationsStore((state) => state.stations);

  useEffect(() => {
    // console.log(activeLine);
    // getDiscoveryVenues(stations);
  }, []);

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
