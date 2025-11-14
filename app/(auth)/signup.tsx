import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import AppGradient from "@/components/AppGradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Missing Fields", "Please fill in all fields.");
    }

    try {
      const res = await fetch("http://172.20.10.5:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return Alert.alert("Signup Failed", data.message || "Try again.");
      }

      Alert.alert("Success", "Account created! Please login now.");
      router.replace("/login");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to connect to the server.");
    }
  };

  return (
    <AppGradient colors={["#161b2e", "#0a4d4a", "#766e67"]}>
      <SafeAreaView className="flex-1 justify-center px-6">
        <Text className="text-white text-4xl font-bold mb-6 text-center">
          Sign Up
        </Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor="#ccc"
          value={name}
          onChangeText={setName}
          className="bg-white/10 text-white px-4 py-3 rounded-xl mb-4"
        />

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

        <CustomButton title="Sign Up" onPress={handleSignup} />

        <Text
          className="text-center text-gray-300 mt-4"
          onPress={() => router.push("/login")}
        >
          Already have an account? Login
        </Text>
      </SafeAreaView>
    </AppGradient>
  );
}
