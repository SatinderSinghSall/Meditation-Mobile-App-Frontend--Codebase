import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

import AppGradient from "@/components/AppGradient";
import MEDITATION_IMAGES from "@/constants/meditation-images";
import { MEDITATION_DATA } from "@/constants/MeditationData";
import ConfirmDialog from "@/components/ConfirmDialog";
import { getStats } from "@/api/meditationApi";

const { width } = Dimensions.get("window");

const Page = () => {
  const [userName, setUserName] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [stats, setStats] = useState({
    totalMinutes: 0,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    meditationHistory: [],
    weeklyChart: [],
    lastSession: null as any,
  });

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

    loadStatsFromBackend();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStatsFromBackend();
    }, [])
  );

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

  // compute weekly totals for last 7 days (Mon..Sun mapping)
  const computeWeeklyStats = (history: any[]) => {
    const now = new Date();
    // days array mapped to display labels (Mon..Sun)
    const labels = ["S", "M", "T", "W", "T", "F", "S"];

    // index 0..6 for Sun..Sat
    const totals = new Array(7).fill(0);

    history.forEach((entry) => {
      const d = new Date(entry.date);
      const diff = Math.floor(
        (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff < 7) {
        const dayIndex = d.getDay();
        totals[dayIndex] += entry.minutes || 0;
      }
    });

    return totals.map((v, idx) => ({ day: labels[idx], value: v }));
  };

  const loadStatsFromBackend = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const data = await getStats(token);

      // data is expected to be same shape as /stats and /add responses now
      const history = data.meditationHistory || [];
      const weekly = computeWeeklyStats(history);
      const lastSession = history.length ? history[history.length - 1] : null;

      setStats((prev) => ({
        ...prev,
        totalMinutes: data.totalMinutes || 0,
        totalSessions: data.totalSessions || 0,
        currentStreak: data.currentStreak || 0,
        longestStreak: data.longestStreak || 0,
        meditationHistory: history,
        weeklyChart: weekly,
        lastSession,
      }));
    } catch (e) {
      console.log("Error fetching stats:", e);
    }
  };

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      {/* --- Stats Row --- */}
      <View style={styles.statsGrid}>
        {[
          { label: "Sessions", value: stats.totalSessions },
          { label: "Minutes", value: stats.totalMinutes },
          { label: "Streak", value: `${stats.currentStreak} Days` },
          { label: "Longest", value: `${stats.longestStreak} Days` },
        ].map((s, i) => (
          <View key={i} style={styles.statsItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Continue card (dynamic) */}
      <Pressable
        style={styles.continueCard}
        onPress={() => {
          // if last session exists, open that meditation, otherwise open default
          if (stats.lastSession?.meditationId) {
            router.push(`/meditate/${stats.lastSession.meditationId}`);
          } else {
            router.push(`/meditate/1`);
          }
        }}
      >
        <View>
          <Text style={styles.continueTitle}>Continue</Text>
          <Text style={styles.continueSubtitle}>
            {stats.lastSession
              ? `${stats.lastSession.minutes}-Min ${
                  stats.lastSession.title || "Session"
                }`
              : "Start your first session"}
          </Text>
        </View>
        <MaterialCommunityIcons name="play-circle" size={40} color="#fff" />
      </Pressable>

      {/* Quote */}
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>
          “Peace comes from within. Do not seek it without.”
        </Text>
      </View>

      {/* Weekly graph */}
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>This Week</Text>

        <View style={styles.graphBarRow}>
          {(stats.weeklyChart.length
            ? stats.weeklyChart
            : [
                { day: "M", value: 0 },
                { day: "T", value: 0 },
                { day: "W", value: 0 },
                { day: "T", value: 0 },
                { day: "F", value: 0 },
                { day: "S", value: 0 },
                { day: "S", value: 0 },
              ]
          ).map((item, idx) => (
            <View key={idx} style={styles.graphBarItem}>
              <View
                style={[
                  styles.graphBar,
                  { height: item.value === 0 ? 4 : Math.max(4, item.value) },
                ]}
              />
              <Text style={styles.graphDay}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1">
      <AppGradient colors={["#0f172a", "#134e4a", "#433d3c"]}>
        <View className="px-5 pb-4 relative z-50">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-white text-4xl font-extrabold mb-1">
                Welcome, {userName || "Guest"}
              </Text>
              <Text className="text-gray-200 text-lg opacity-85">
                Start your meditation journey
              </Text>
            </View>

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

          {/* Animated dropdown */}
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

        {/* Meditation list */}
        <FlatList
          data={MEDITATION_DATA}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
          ListHeaderComponent={renderDashboard}
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
    backdropFilter: "blur(20px)",
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

  dashboardContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 5,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  statValue: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 4,
  },

  continueCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    marginBottom: 25,
  },
  continueTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
  },
  continueSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    marginTop: 3,
  },

  quoteBox: {
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 18,
    borderRadius: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  quoteText: {
    color: "white",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },

  graphContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    marginBottom: 20,
  },
  graphTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  graphBarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  graphBarItem: {
    alignItems: "center",
  },
  graphBar: {
    width: 12,
    backgroundColor: "white",
    borderRadius: 6,
  },
  graphDay: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 6,
    fontSize: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statsItem: {
    width: "48%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
});

export default Page;
