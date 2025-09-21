import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaFrameContext } from "react-native-safe-area-context";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <Text className="text-4xl text-red-500">Welcome to the RealState App   </Text>
      <Link href="/sign-in" >Sign In</Link>
      <Link href='/(root)/(tabs)/explore'>Explore</Link>
      <Link href='/(root)/(tabs)/profile'>Profile</Link>
      <Link href='/properties/1'>Property</Link>
    </View>
  );
}
