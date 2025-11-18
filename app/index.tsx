import { View, Text, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";

import beachImage from "@/assets/meditation-images/beach.webp";

/*
 🚀 Frontend Mobile Commands:

 ▶️ Development Mode:
 npx expo start -c

 ▶️ Production Mode:
 NODE_ENV=production npx expo start
*/

// To run the apps frontend / mobile (development) -  npx expo start -c

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1">
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}>
          <SafeAreaView className="flex flex-1 px-1 justify-between">
            <Animated.View
              entering={FadeInDown.delay(300)
                .mass(0.5)
                .stiffness(80)
                .springify(20)}
            >
              <Text className="text-center text-white font-bold text-4xl">
                Simple Meditation
              </Text>
              <Text className="text-center text-white text-2xl mt-3">
                Simplifying Meditation for Everyone
              </Text>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300)}>
              <CustomButton
                onPress={() => router.push("/login")}
                title="Get Started"
              />
            </Animated.View>

            <StatusBar style="light" />
          </SafeAreaView>
        </AppGradient>
      </ImageBackground>
    </View>
  );
}
