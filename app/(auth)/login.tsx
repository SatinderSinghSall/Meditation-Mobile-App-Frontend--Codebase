import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import AuthButton from "@/components/AuthButton";
import AppGradient from "@/components/AppGradient";

import { login } from "@/api/authApi";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Missing Fields", "Please enter email and password.");
    }

    setLoading(true);

    try {
      const data = await login(email, password);

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);

      Alert.alert("Welcome", `Hi ${data.user.name}!`);
      router.replace("/(tabs)/nature-meditate");
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      Alert.alert("Login Failed", err.message || "Try again.");
    }
  };

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <SafeAreaView className="flex-1 items-center justify-center px-6">
        {/* Back Button (Safe-area aware) */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: 16,
            zIndex: 50,
          }}
          className="bg-white/10 px-3 py-2 rounded-full flex-row items-center border border-white/20"
        >
          <Ionicons name="chevron-back" size={20} color="white" />
          <Text className="text-white ml-1 font-medium">Back</Text>
        </TouchableOpacity>

        {/* App Name */}
        <Text className="text-white text-3xl font-semibold mb-8">
          Meditation App
        </Text>

        {/* Form Container */}
        <View className="bg-white/10 w-full p-6 rounded-2xl backdrop-blur-md shadow-lg max-w-md">
          <Text className="text-white text-3xl font-bold mb-6 text-center">
            Welcome Back
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#bbb"
            value={email}
            onChangeText={setEmail}
            className="bg-white/5 text-white px-4 py-3 rounded-xl mb-4 border border-white/10"
          />

          <View className="relative mb-6">
            <TextInput
              placeholder="Password"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              className="bg-white/5 text-white px-4 py-3 rounded-xl border border-white/10 pr-12"
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <AuthButton
            title="Login"
            loading={loading}
            loadingText="Signing in..."
            onPress={handleLogin}
          />
        </View>

        {/* Signup Link */}
        <Text
          className="text-center text-gray-200 mt-6"
          onPress={() => router.push("/signup")}
        >
          Don’t have an account?{" "}
          <Text className="text-white font-semibold">Sign up</Text>
        </Text>
      </SafeAreaView>
    </AppGradient>
  );
}
