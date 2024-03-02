import { Text, View, Button } from "react-native";
import { Link, useRouter } from "expo-router";

const SettingsScreen = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Hello</Text>
      <Link push href="/primary/primary">
        <Text>Back</Text>
      </Link>
      <Link href="/">
        <Text>Logout</Text>
      </Link>
    </View>
  );
};

export default SettingsScreen;
