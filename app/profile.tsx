import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppGradient from "@/components/AppGradient";

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00ffff" />
      </View>
    );
  }

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Header */}
        <Text style={styles.header}>Profile</Text>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={["#24c6dc", "#514a9d"]}
            style={styles.avatarGradient}
          >
            <Ionicons name="person" size={60} color="#fff" />
          </LinearGradient>
          <Text style={styles.avatarName}>{user?.name || "Guest User"}</Text>
        </View>

        {/* Glassmorphism Card */}
        <View style={styles.glassCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="person" size={26} color="#7de2e2" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{user?.name || "Guest"}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={26} color="#7de2e2" />
            <View style={styles.infoText}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutWrapper} onPress={handleLogout}>
          <LinearGradient
            colors={["#ff5f6d", "#ffc371"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoutButton}
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </AppGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },

  backButton: {
    position: "absolute",
    left: 20,
    top: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 8,
    borderRadius: 40,
  },

  header: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  avatarGradient: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },

  avatarName: {
    marginTop: 12,
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 50,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },

  infoText: {
    marginLeft: 14,
  },

  label: {
    color: "#b7c8d0",
    fontSize: 13,
    marginBottom: 2,
  },

  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginVertical: 12,
  },

  logoutWrapper: {
    alignSelf: "center",
    width: "70%",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },

  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
