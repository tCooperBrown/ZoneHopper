import { Link } from "expo-router";
import { StyleSheet, View, Text, Pressable } from "react-native";

export default function DiscoveryButton() {
  return (
    <View style={styles.container}>
      <Link href="/discovery/discovery" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Discovery Challenge</Text>
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
    backgroundColor: "#040FAB",
    // height: "15%",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#7C7CCC",
    // textAlign: "center",
    justifyContent: "center",
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 10,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 20,
    marginBottom: 30,

    // height: 20,
    // width: 60,
  },
});
