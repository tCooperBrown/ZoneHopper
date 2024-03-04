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
import { useLineStore } from "../../components/upper-bar";

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

export default function Discovery() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
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
  const activeLine = useLineStore((state) => state.line);

  // console.log("discovery venue state", discoveryVenueState);

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      setIsLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLoadError("Permission to access location was denied");
          return;
        }

        const { currentDiscoveryVenues, currentDiscoveryStation } =
          await getDiscoveryVenues(activeLine);

        updateDiscoveryVenues([...currentDiscoveryVenues]);
        updateDiscoveryStationState(currentDiscoveryStation);

        setRegion({
          latitude: currentDiscoveryVenues[0].latitude,
          longitude: currentDiscoveryVenues[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        setLoadError("Failed to fetch discovery challenge. Please try again.");
        console.error("error line 77", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveryData();

    // (async () => {
    //   let { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status !== "granted") {
    //     setErrorMsg("Permission to access location was denied");
    //     return;
    //   }
    //   // console.log("activeLine", activeLine);
    //   const { currentDiscoveryVenues, currentDiscoveryStation } =
    //     await getDiscoveryVenues(activeLine);

    //   // console.log("useeffect currentDiscoveryVenues: ", currentDiscoveryVenues);
    //   // console.log(
    //   //   "useeffect currendtDiscoveryStation: ",
    //   //   currentDiscoveryStation,
    //   // );

    //   // This will be accessible as an array of venues ranked by popularity.
    //   updateDiscoveryVenues([...(await currentDiscoveryVenues)]);
    //   // This will be directly accessible as a single station Object.
    //   updateDiscoveryStationState(await currentDiscoveryStation);
    //   setRegion({
    //     latitude: await currentDiscoveryVenues[0].latitude,
    //     longitude: await currentDiscoveryVenues[0].longitude,
    //     latitudeDelta: 0.01,
    //     longitudeDelta: 0.01,
    //   });

    //   // console.log("currentDiscoveryVenues: ", currentDiscoveryVenues);
    //   // console.log("\ncurrentDiscoveryStation: ", currentDiscoveryStation);
    //   // console.log(currentDiscoveryVenues[0].location);
    //   // console.log(discoveryStationState);
    //   // console.log(discoveryVenueState[0].displayName);

    //   // console.log("discoveryVenueState: ", await discoveryVenueState);

    //   // console.log("\nregion", region);
    // })();
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
    console.log("discoveryStationState line 139", discoveryStationState);
    let successCheck = await validateCheckIn({
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      venueLat: discoveryStationState.lat,
      venueLon: discoveryStationState.lon,
    });

    // let outcome = await successCheck.json();
    console.log("discoveryStationState line 148: ", discoveryStationState);
    console.log("discoveryVenueState line 149: ", discoveryVenueState);

    (await successCheck)
      ? alert("We've checked you in!")
      : alert("Sorry, you don't appear to be close enough...");
  }

  async function _handleExternalMap() {
    let result = await WebBrowser.openBrowserAsync(
      discoveryVenueState[0].googleMapsUri,
    );
    setResult(result);
  }
  return (
    <>
      {!isLoading && !loadError && (
        <>
          <View style={styles.container}>
            {/* upperbar container */}
            <View style={styles.upperBarContainer}>
              {/* Back Button */}
              <View style={styles.backButton}>
                <Link replace href="/primary/primary">
                  <Text style={styles.text}>Back</Text>
                </Link>
              </View>

              <View style={styles.daysLeft}>
                <Text style={styles.text}>
                  Days Left: {dayDictionary.get(new Date().getDay().toString())}
                </Text>
              </View>
            </View>
            {/* Maps */}

            {discoveryVenueState.length > 0 ? (
              <MapView style={styles.map} region={region}>
                <Marker
                  coordinate={{
                    latitude: discoveryVenueState[0]?.latitude || 0,
                    longitude: discoveryVenueState[0]?.longitude || 0,
                  }}
                  onPress={_handleExternalMap}
                />
              </MapView>
            ) : (
              <Text></Text>
            )}

            {/* Venue Description */}

            <View style={styles.restaurantDescriptionContainer}>
              <Text style={styles.text}>
                {discoveryStationState?.name || ""}
              </Text>
              <Text style={styles.text}>
                {discoveryVenueState.length > 0
                  ? discoveryVenueState[0]?.displayName || ""
                  : ""}
              </Text>
              <Text style={styles.text}>
                {discoveryVenueState.length > 0
                  ? discoveryVenueState[0]?.editorialSummary || ""
                  : ""}
              </Text>
            </View>
            {/* Restaurant Images */}
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={imageURL} />
            </View>
            {/* Check In Button! */}

            <View style={styles.bottomBar}>
              <Pressable style={styles.button} onPress={onPress}>
                <View style={styles.checkInButton}>
                  <Text style={styles.text}>Check In!</Text>
                </View>
              </Pressable>
            </View>
            {/* end of master container View */}
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    backgroundColor: "#040FAB",
    paddingLeft: 40,
    // justifyContent: "center",
  },
  checkInButton: {
    backgroundColor: "#7C7CCC",
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },

  daysLeft: {
    justifyContent: "center",
  },
  backButton: {
    height: 50,
    width: 80,
    backgroundColor: "#5758C1",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    // fontFamily: "Montserrat_400Regular",
  },
  container: {
    flex: 1,
  },
  upperBarContainer: {
    flexDirection: "row",
    backgroundColor: "#040FAB",
    justifyContent: "space-between",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  map: {
    width: "100%",
    height: "50%",
  },
  restaurantDescriptionContainer: {
    height: "23%",
    padding: 20,
    gap: 10,
    backgroundColor: "#040FAB",
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
