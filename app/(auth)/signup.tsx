import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AuthButton from "@/components/AuthButton";
import { signup } from "@/api/authApi";

export default function Signup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Missing Fields", "Please fill in all fields.");
    }

    try {
      setLoading(true);
      await signup(name, email, password);

      Alert.alert("Success", "Account created! You can now log in.");
      router.replace("/login");
    } catch (err: any) {
      Alert.alert("Signup Failed", err.message || "Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* 🍃 Premium Gradient Background */}
      <LinearGradient
        colors={["#0f172a", "#0d4040", "#1b263b"]}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: insets.top + 14,
              left: 16,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.10)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.18)",
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#fff" />
            <Text
              style={{
                color: "#fff",
                fontSize: 15,
                fontWeight: "600",
                marginLeft: 2,
              }}
            >
              Back
            </Text>
          </TouchableOpacity>

          <KeyboardAvoidingView
            behavior={Platform.select({
              ios: "padding",
              android: "height",
            })}
            style={{ flex: 1 }}
          >
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 26,
                justifyContent: "center",
              }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 34,
                  fontWeight: "800",
                  color: "white",
                  marginBottom: 6,
                }}
              >
                Create Account
              </Text>

              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 30,
                }}
              >
                Start your meditation journey 🌿
              </Text>

              {/* Glass Card */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.15)",
                  borderRadius: 22,
                  padding: 22,
                  gap: 14,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 18,
                  shadowOffset: { width: 0, height: 6 },
                }}
              >
                {/* Name */}
                <View style={{ gap: 6 }}>
                  <Text style={{ color: "#ffffffcc", fontSize: 14 }}>
                    Full Name
                  </Text>
                  <TextInput
                    placeholder="Your name"
                    placeholderTextColor="#889"
                    value={name}
                    onChangeText={setName}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      color: "#fff",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.14)",
                      fontSize: 15,
                    }}
                  />
                </View>

                {/* Email */}
                <View style={{ gap: 6 }}>
                  <Text style={{ color: "#ffffffcc", fontSize: 14 }}>
                    Email
                  </Text>
                  <TextInput
                    placeholder="your@email.com"
                    placeholderTextColor="#889"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      color: "#fff",
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.14)",
                      fontSize: 15,
                    }}
                  />
                </View>

                {/* Password */}
                <View style={{ gap: 6 }}>
                  <Text style={{ color: "#ffffffcc", fontSize: 14 }}>
                    Password
                  </Text>
                  <View style={{ position: "relative" }}>
                    <TextInput
                      placeholder="Min. 6 characters"
                      placeholderTextColor="#889"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: 14,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        color: "#fff",
                        borderWidth: 1,
                        borderColor: "rgba(255,255,255,0.14)",
                        fontSize: 15,
                        paddingRight: 46,
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: 10, top: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit */}
                <AuthButton
                  title="Sign Up"
                  loading={loading}
                  loadingText="Creating account..."
                  onPress={handleSignup}
                />
              </View>

              {/* Login Redirect */}
              <TouchableOpacity
                onPress={() => router.push("/login")}
                style={{ marginTop: 28 }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    textAlign: "center",
                    fontSize: 14,
                  }}
                >
                  Already have an account?{" "}
                  <Text style={{ color: "white", fontWeight: "700" }}>
                    Log in
                  </Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
