import { Link } from "expo-router";
import { StyleSheet, View, Text, Pressable } from "react-native";

export default function DiscoveryButton() {
  return (
    <View style={styles.container}>
      <Link href="/discovery/discovery" asChild>
        <Pressable style={styles.button}>
          <Text>Discovery Challenge</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "violet",
    height: "15%",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "yellow",
    // textAlign: "center",
    justifyContent: "center",

    // height: 20,
    // width: 60,
  },
});
