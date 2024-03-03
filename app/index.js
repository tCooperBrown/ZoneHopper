import { Link, Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Home() {
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
