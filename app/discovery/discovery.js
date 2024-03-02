import { validateCheckIn } from "../../api-client-service";
import React, { useState } from "react";
import MapView from "react-native-maps";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import { useFonts, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as WebBrowser from "expo-web-browser";

export default function Discovery() {
  const [result, setResult] = useState(null);

  const dayDictionary = new Map();
  dayDictionary.set("0", 7);
  dayDictionary.set("1", 6);
  dayDictionary.set("2", 5);
  dayDictionary.set("3", 4);
  dayDictionary.set("4", 3);
  dayDictionary.set("5", 2);
  dayDictionary.set("6", 1);
  dayDictionary.set("7", 0);

  const nearestStation = "Waterloo";
  const venueName = "BrewDog";
  const venueDescription =
    "Sprawling brewhouse with 60 taps of draught beer, duckpin bowling, an ice cream truck & a slide.";

  const imageURL = "https://picsum.photos/seed/696/3000/2000";

  async function onPress() {
    let successCheck = await validateCheckIn({
      lat: 51.581786,
      lon: -0.316946,
      venueLat: 51.581786,
      venueLon: -0.422198,
    });

    // let outcome = await successCheck.json();
    // console.log(typeof successCheck);

    successCheck
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

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          onPress={_handleExternalMap}
        />
        {/* {this.state.markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
          />
        ))} */}
      </MapView>

      {/* Restaurant Description */}
      <View style={styles.restaurantDescriptionContainer}>
        <Text style={styles.text}>{nearestStation}</Text>
        <Text style={styles.text}>{venueName}</Text>
        <Text style={styles.text}>{venueDescription}</Text>
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
