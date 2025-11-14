import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppGradient from "@/components/AppGradient";
import MEDITATION_IMAGES from "@/constants/meditation-images";
import { MEDITATION_DATA } from "@/constants/MeditationData";
import ConfirmDialog from "@/components/ConfirmDialog";

const { width } = Dimensions.get("window");

const Page = () => {
  const [userName, setUserName] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [confirmVisible, setConfirmVisible] = useState(false);

  const openConfirm = () => setConfirmVisible(true);
  const closeConfirm = () => setConfirmVisible(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const firstName = user.name?.split(" ")[0] || "Guest";
          setUserName(firstName);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const toggleMenu = () => {
    if (menuVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.95,
          useNativeDriver: true,
        }),
      ]).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <View className="flex-1">
      <AppGradient colors={["#0f172a", "#134e4a", "#433d3c"]}>
        <View className="px-5 pb-4 relative z-50">
          {/* Header Section */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-white text-4xl font-extrabold mb-1">
                Welcome, {userName || "Guest"}
              </Text>
              <Text className="text-gray-200 text-lg opacity-85">
                Start your meditation journey
              </Text>
            </View>

            {/* Dropdown Toggle */}
            <TouchableOpacity
              onPress={toggleMenu}
              activeOpacity={0.8}
              style={styles.menuButton}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={28}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          {/* Overlay to close dropdown */}
          {menuVisible && (
            <TouchableWithoutFeedback onPress={toggleMenu}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
          )}

          {/* Animated Dropdown */}
          {menuVisible && (
            <Animated.View
              style={[
                styles.dropdown,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  router.push("/profile");
                }}
                activeOpacity={0.85}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="account-circle"
                  size={22}
                  color="#fff"
                />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  openConfirm();
                }}
                activeOpacity={0.85}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color="#f87171"
                />
                <Text style={[styles.menuText, { color: "#f87171" }]}>
                  Logout
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Meditation List */}
        <FlatList
          data={MEDITATION_DATA}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/meditate/${item.id}`)}
              style={styles.cardContainer}
            >
              <ImageBackground
                source={MEDITATION_IMAGES[item.id - 1]}
                resizeMode="cover"
                imageStyle={styles.cardImage}
                style={styles.imageBackground}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.7)"]}
                  style={styles.cardOverlay}
                >
                  <Text className="text-white text-2xl font-semibold text-center">
                    {item.title}
                  </Text>
                </LinearGradient>
              </ImageBackground>
            </Pressable>
          )}
        />

        <ConfirmDialog
          visible={confirmVisible}
          title="Logout?"
          message="Are you sure you want to log out?"
          confirmText="Logout"
          cancelText="Cancel"
          confirmColor="#dc2626"
          onCancel={closeConfirm}
          onConfirm={() => {
            closeConfirm();
            handleLogout();
          }}
        />
      </AppGradient>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 20,
  },
  menuButton: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
  },
  dropdown: {
    position: "absolute",
    top: Platform.OS === "ios" ? 80 : 70,
    right: 15,
    backgroundColor: "rgba(20, 20, 20, 0.8)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    minWidth: 165,
    zIndex: 999,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 16,
    backdropFilter: "blur(20px)", // web-like blur for Expo Web; ignored on native
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  menuText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 8,
  },
  listContainer: {
    paddingVertical: 20,
    paddingBottom: 140,
  },
  cardContainer: {
    width: width * 0.9,
    alignSelf: "center",
    marginBottom: 22,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  imageBackground: {
    height: 200,
    justifyContent: "flex-end",
  },
  cardImage: {
    borderRadius: 20,
  },
  cardOverlay: {
    paddingVertical: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
  },
});

export default Page;
