import {
  generatePlacesPhotoUri,
  getDiscoveryVenues,
  validateCheckIn,
} from "../../api-client-service";
import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";
import {
  useDiscoveryStationStore,
  useDiscoveryVenueStore,
  useLineStore,
  useSuccessfulVisitStore,
} from "../../components/zustand-stores";
import { generatePhotoUri } from "../../api-client-service";
import { LinearGradient } from "expo-linear-gradient";

export default function Discovery() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [photoUri, setPhotoUri] = useState("");
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

  const updateVisitedStations_client = useSuccessfulVisitStore(
    (state) => state.updateVisitedStations_client,
  );
  const updateVisitedVenues_client = useSuccessfulVisitStore(
    (state) => state.updateVisitedVenues_client,
  );

  const visitedStations_client = useSuccessfulVisitStore(
    (state) => state.visitedStations_client,
  );
  const visitedVenues_client = useSuccessfulVisitStore(
    (state) => state.visitedVenues_client,
  );

  const activeLine = useLineStore((state) => state.line);

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

        const newPhotoUri = await generatePhotoUri(
          currentDiscoveryVenues[0].photos[0].name,
        );

        setPhotoUri(await newPhotoUri);
      } catch (error) {
        setLoadError("Failed to fetch discovery challenge. Please try again.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveryData();
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

  async function onPress() {
    // console.log("discoveryVenueState line 149: ", discoveryVenueState);
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    let successCheck = await validateCheckIn({
      lat: location.coords.latitude,
      lon: location.coords.longitude,
      venueLat: discoveryVenueState[0].latitude,
      venueLon: discoveryVenueState[0].longitude,
      venueName: discoveryVenueState[0].displayName,
      stationName: discoveryStationState.name,
      activeLine: activeLine,
    });

    const clientAccept = await successCheck.success;

    if (clientAccept) {
      alert("We've checked you in!");
      updateVisitedStations_client(
        await successCheck.postUpdate.visitedStations,
      );
      updateVisitedVenues_client(await successCheck.postUpdate.visitedVenues);
    } else {
      alert("Sorry, you don't appear to be close enough...");
    }
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
        <View style={{ flex: 1, backgroundColor: "#000439" }}>
          <View style={styles.container}>
            {/* upperbar container */}
            <View style={styles.upperBarContainer}>
              {/* Back Button */}
              <View style={styles.backButton}>
                <Link replace href="/primary/primary" asChild>
                  <Pressable>
                    <Text style={[styles.text, { fontWeight: "600" }]}>
                      Back
                    </Text>
                  </Pressable>
                </Link>
              </View>

              <View style={styles.daysLeft}>
                <Text style={[styles.text, { fontWeight: "400" }]}>
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
              <></>
            )}

            {/* Venue Description */}

            <View style={styles.restaurantDescriptionContainer}>
              <Text style={[styles.text, { fontWeight: "700" }]}>
                {discoveryStationState?.name || ""}
              </Text>
              <Text
                style={[
                  styles.text,
                  { fontStyle: "italic", fontWeight: "600" },
                ]}
              >
                {discoveryVenueState.length > 0
                  ? discoveryVenueState[0]?.displayName || ""
                  : ""}
              </Text>
              <Text style={[styles.text, { fontWeight: "300", fontSize: 20 }]}>
                {discoveryVenueState.length > 0
                  ? discoveryVenueState[0]?.editorialSummary || ""
                  : ""}
              </Text>
            </View>
            {/* Restaurant Images */}
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: photoUri }} />
            </View>
            {/* Check In Button! */}

            {/* <View style={styles.bottomBar}>
              <Pressable style={styles.button} onPress={onPress}>
                <View style={styles.checkInButton}>
                  <Text style={[styles.text, { fontWeight: "700" }]}>
                    Check In!
                  </Text>
                </View>
              </Pressable>
            </View> */}

            <View style={styles.bottomBar}>
              <Pressable style={styles.button} onPress={onPress}>
                <LinearGradient
                  colors={[
                    "#7c7ccc",
                    "#6563c6",
                    "#4d4abe",
                    "#3230b5",
                    "#040fab",
                  ]}
                  style={styles.checkInButton}
                >
                  <Text style={[styles.text, { fontWeight: "700" }]}>
                    Check In!
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* end of master container View */}
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
  },
  checkInButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 300,
    paddingBottom: 10,
    paddingTop: 10,
    marginBottom: 5,
  },

  daysLeft: {
    justifyContent: "center",
  },
  backButton: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#7C7CCC",
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
    paddingLeft: 15,
    paddingRight: 15,
  },
  upperBarContainer: {
    flexDirection: "row",
    // backgroundColor: "#040FAB",
    justifyContent: "space-between",
    // paddingRight: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  map: {
    width: "100%",
    height: "40%",
    borderRadius: 15,
  },
  restaurantDescriptionContainer: {
    marginBottom: 10,
    paddingTop: 5,
    gap: 10,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    paddingBottom: 5,
  },
});
