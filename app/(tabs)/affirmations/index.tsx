import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import GuidedAffirmationsGallery from "@/components/GuidedAffirmationsGallery";
import AFFIRMATION_GALLERY from "@/constants/affirmation-gallary";

const { width } = Dimensions.get("window");

const Page = () => {
  const insets = useSafeAreaInsets();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1E1B3A", "#3A2D5E", "#5A3C7A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.background, { paddingTop: insets.top }]}
      >
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 100,
            paddingHorizontal: 20,
            paddingTop: 24,
          }}
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.textWrapper}>
              <Text
                style={styles.heading}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                maxFontSizeMultiplier={1}
                allowFontScaling={false}
              >
                ✨ Guided Affirmations
              </Text>
              <Text
                style={styles.subText}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.9}
                maxFontSizeMultiplier={1}
                allowFontScaling={false}
              >
                Empower your mind with daily positive beliefs
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={styles.favoriteButton}>
              <MaterialCommunityIcons
                name="heart-outline"
                size={26}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Gallery Section */}
          <View style={{ marginTop: 25 }}>
            {AFFIRMATION_GALLERY.map((g, index) => (
              <Animated.View
                key={g.title}
                style={[
                  styles.galleryBlock,
                  {
                    transform: [
                      {
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20 * (index + 1), 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <GuidedAffirmationsGallery title={g.title} products={g.data} />
              </Animated.View>
            ))}
          </View>
        </Animated.ScrollView>

        <StatusBar style="light" />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: { flex: 1 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
    flexShrink: 1,
    paddingRight: 10,
    overflow: "hidden",
  },
  heading: {
    color: "#fff",
    fontSize: width < 360 ? 24 : width < 400 ? 26 : 30,
    fontWeight: "800",
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  subText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: width < 360 ? 13 : width < 400 ? 14 : 16,
    marginTop: 4,
    fontWeight: "400",
    includeFontPadding: false,
  },
  favoriteButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-start",
  },
  galleryBlock: {
    marginBottom: 28,
  },
});

export default Page;
