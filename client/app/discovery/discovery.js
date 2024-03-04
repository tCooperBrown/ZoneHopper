import { getDiscoveryVenues, validateCheckIn } from "../../api-client-service";
import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { useFonts, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import { create } from "zustand";

export const useDiscoveryVenueStore = create((set) => ({
  discoveryVenues: [],
  updateDiscoveryVenues: (newDiscoveryVenue) =>
    set({ discoveryVenues: newDiscoveryVenue }),
}));
export const useDiscoveryStationStore = create((set) => ({
  discoveryStation: [],
  updateDiscoveryStation: (newDiscoveryStation) =>
    set({ discoveryStation: newDiscoveryStation }),
}));

// 98244888, 53088789122;

export default function Discovery() {
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 51.514316,
    longitude: -0.126933,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const updateDiscoveryVenues = useDiscoveryVenueStore(
    (state) => state.updateDiscoveryVenues,
  );
  const discoveryVenueState = useDiscoveryVenueStore(
    (state) => state.discoveryVenues,
  );
  const updateDiscoveryStationState = useDiscoveryStationStore(
    (state) => state.updateDiscoveryStation,
  );
  const discoveryStationState = useDiscoveryStationStore(
    (state) => state.discoveryStation,
  );

  // console.log("discovery venue state", discoveryVenueState);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const { currentDiscoveryVenues, currentDiscoveryStation } =
        await getDiscoveryVenues();
      // console.log("useeffect currentDiscoveryVenues: ", currentDiscoveryVenues);
      // console.log(
      //   "useeffect currendtDiscoveryStation: ",
      //   currentDiscoveryStation,
      // );

      // This will be accessible as an array of venues ranked by popularity.
      // This will be directly accessible as a single station Object.

      // async function updateDiscoveryandRegion() {
      //   await updateDiscoveryVenues([...currentDiscoveryVenues]);
      //   await updateDiscoveryStationState(currentDiscoveryStation);
      //   setRegion({
      //     latitude: currentDiscoveryVenues[0].latitude,
      //     longitude: currentDiscoveryVenues[0].longitude,
      //     latitudeDelta: 0.01,
      //     longitudeDelta: 0.01,
      //   });
      // }
      // updateDiscoveryandRegion();

      updateDiscoveryVenues([...currentDiscoveryVenues]);
      updateDiscoveryStationState(currentDiscoveryStation);
      setRegion({
        latitude: currentDiscoveryVenues[0].latitude,
        longitude: currentDiscoveryVenues[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // console.log("currentDiscoveryVenues: ", currentDiscoveryVenues);
      // console.log("\ncurrentDiscoveryStation: ", currentDiscoveryStation);
      // console.log(currentDiscoveryVenues[0].location);
      // console.log(discoveryStationState);
      // console.log(discoveryVenueState[0].displayName);

      // console.log("discoveryVenueState: ", await discoveryVenueState);

      // console.log("\nregion", region);
    })();
  }, []);

  // I'm going to update this. The backend now starts the clock at any given day/time. Counting days of the week here needs to go.
  const dayDictionary = new Map();
  dayDictionary.set("0", 1);
  dayDictionary.set("1", 7);
  dayDictionary.set("2", 6);
  dayDictionary.set("3", 5);
  dayDictionary.set("4", 4);
  dayDictionary.set("5", 3);
  dayDictionary.set("6", 2);

  const imageURL = "https://picsum.photos/seed/696/3000/2000";

  async function onPress() {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    console.log(discoveryStationState);
    let successCheck = await validateCheckIn({
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      venueLat: discoveryStationState.lat,
      venueLon: discoveryStationState.lon,
    });

    // let outcome = await successCheck.json();
    console.log("discoveryStationState: ", discoveryStationState);
    console.log("discoveryVenueState: ", discoveryVenueState);

    (await successCheck)
      ? alert("We've checked you in!")
      : alert("Sorry, you don't appear to be close enough...");
  }

  async function _handleExternalMap() {
    let result = await WebBrowser.openBrowserAsync("https://youtube.com");
    setResult(result);
  }

  return (
    <View style={styles.container}>
      {/* upperbar container */}
      <View style={styles.upperBarContainer}>
        <Link replace href="/primary/primary">
          <Text style={styles.text}>Back to primary</Text>
        </Link>

        <Text>
          Days Left: {dayDictionary.get(new Date().getDay().toString())}
        </Text>
      </View>
      {/* Maps */}

      {discoveryVenueState.length > 0 ? (
        <MapView style={styles.map} region={region}>
          <Marker
            coordinate={{
              latitude: discoveryVenueState[0].latitude,
              longitude: discoveryVenueState[0].longitude,
            }}
            onPress={_handleExternalMap}
          />
        </MapView>
      ) : (
        <Text></Text>
      )}

      {/* Restaurant Description */}
      <View style={styles.restaurantDescriptionContainer}>
        <Text style={styles.text}>{discoveryStationState.name}</Text>
        <Text style={styles.text}>
          {discoveryVenueState.length > 0
            ? discoveryVenueState[0].displayName
            : ""}
        </Text>
        <Text style={styles.text}>
          {discoveryVenueState.length > 0
            ? discoveryVenueState[0].editorialSummary
            : ""}
        </Text>
      </View>
      {/* Restaurant Images */}
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={imageURL} />
      </View>
      {/* Check In Button! */}
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>Check In!</Text>
      </Pressable>
      {/* end of master container View */}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 18,
    // fontFamily: "Montserrat_400Regular",
  },
  container: {
    backgroundColor: "blue", //
    flex: 1,
  },
  upperBarContainer: {
    flexDirection: "row",
    backgroundColor: "green", //
    justifyContent: "space-between",
  },
  map: {
    width: "100%",
    height: "50%",
  },
  restaurantDescriptionContainer: {
    height: "23%",
    padding: 20,
    gap: 10,
    backgroundColor: "orange",
  },
  image: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "pink",
  },
});
