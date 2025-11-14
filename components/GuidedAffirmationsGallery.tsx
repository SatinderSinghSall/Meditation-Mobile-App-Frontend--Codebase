import React, { useRef } from "react";
import {
  Image,
  View,
  Text,
  FlatList,
  Pressable,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { GalleryPreviewData } from "@/constants/models/Product";

interface GuidedAffirmationsGalleryProps {
  title: string;
  products: GalleryPreviewData[];
}

const { width } = Dimensions.get("window");

const GuidedAffirmationsGallery = ({
  title,
  products,
}: GuidedAffirmationsGalleryProps) => {
  return (
    <View
      style={{
        marginVertical: 24,
      }}
    >
      {/* Section Title */}
      <View
        style={{
          marginBottom: 14,
          paddingHorizontal: 4,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: width < 360 ? 18 : 22,
            fontWeight: "800",
            letterSpacing: 0.3,
          }}
        >
          {title}
        </Text>
      </View>

      {/* Gallery */}
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingRight: 16,
          paddingLeft: 2,
        }}
        renderItem={({ item }) => <GalleryCard item={item} />}
      />
    </View>
  );
};

const GalleryCard = ({ item }: { item: GalleryPreviewData }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 25,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 8,
    }).start();
  };

  const cardWidth = width * 0.4; // responsive width
  const cardHeight = cardWidth * 1.25;

  return (
    <Link href={`/affirmations/${item.id}`} asChild>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            width: cardWidth,
            height: cardHeight,
            marginRight: 18,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#1f1f2e",
            shadowColor: "#000",
            shadowOpacity: Platform.OS === "ios" ? 0.25 : 0.35,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }}
        >
          <Image
            source={item.image}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 20,
            }}
          />

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.65)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "55%",
              justifyContent: "flex-end",
              paddingHorizontal: 12,
              paddingBottom: 10,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                color: "#fff",
                fontSize: width < 360 ? 13 : 15,
                fontWeight: "600",
                textShadowColor: "rgba(0,0,0,0.5)",
                textShadowRadius: 3,
              }}
            >
              {item.title ?? ""}
            </Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </Link>
  );
};

export default GuidedAffirmationsGallery;
