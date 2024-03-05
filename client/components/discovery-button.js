import { Link } from "expo-router";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function DiscoveryButton() {
  return (
    <View style={styles.container}>
      <Link href="/discovery/discovery" asChild>
        <Pressable>
          <LinearGradient
            colors={["#7c7ccc", "#6563c6", "#4d4abe", "#3230b5", "#040fab"]}
            style={styles.button}
          >
            <Text style={styles.text}>Discovery Challenge</Text>
          </LinearGradient>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 25,
  },
  container: {
    flexDirection: "row",
    // backgroundColor: "#040FAB",
    // height: "15%",
    justifyContent: "center",
  },
  button: {
    alignItems: "center",
    width: 350,
    backgroundColor: "#7C7CCC",
    // textAlign: "center",
    justifyContent: "center",
    // paddingLeft: 30,
    // paddingRight: 30,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 20,
    marginBottom: 30,
  },
});
