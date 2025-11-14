import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Missing Fields", "Please enter email and password.");
    }

    try {
      const res = await fetch("http://172.20.10.5:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return Alert.alert("Login Failed", data.message || "Try again.");
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Welcome", `Hi ${data.user.name}!`);
      router.replace("/(tabs)/nature-meditate");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to connect to server.");
    }
  };

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <SafeAreaView className="flex-1 justify-center px-6">
        <Text className="text-white text-4xl font-bold mb-6 text-center">
          Login
        </Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          className="bg-white/10 text-white px-4 py-3 rounded-xl mb-4"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-white/10 text-white px-4 py-3 rounded-xl mb-6"
        />

        <CustomButton title="Login" onPress={handleLogin} />
        <Text
          className="text-center text-gray-300 mt-4"
          onPress={() => router.push("/signup")}
        >
          Don’t have an account? Sign up
        </Text>
      </SafeAreaView>
    </AppGradient>
  );
}
