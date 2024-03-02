import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Home() {
  return (
    <View>
      <Link replace href="/primary/primary">
        <Text>Mock Login</Text>
      </Link>
    </View>
  );
}
