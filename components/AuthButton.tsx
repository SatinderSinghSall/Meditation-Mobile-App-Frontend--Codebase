import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  GestureResponderEvent,
  View,
} from "react-native";

interface AuthButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  loading?: boolean;
  loadingText?: string;
}

export default function AuthButton({
  title,
  onPress,
  loading = false,
  loadingText = "",
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`bg-white/20 py-3 rounded-xl items-center justify-center flex-row ${
        loading ? "opacity-50" : ""
      }`}
      style={{ minHeight: 50 }}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color="#fff"
          style={{ marginRight: 8 }}
        />
      )}

      <Text className="text-white text-lg font-semibold">
        {loading ? loadingText : title}
      </Text>
    </TouchableOpacity>
  );
}
