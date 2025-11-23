import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

type Props = {
  value: number;
  day: string;
};

const Tooltip: React.FC<Props> = ({ value, day }) => (
  <View style={styles.container}>
    <BlurView intensity={35} tint="dark" style={styles.blur}>
      <Text style={styles.day}>{day}</Text>
      <Text style={styles.value}>{value} min</Text>
    </BlurView>

    {/* Triangle pointer */}
    <View style={styles.pointer} />
  </View>
);

export default Tooltip;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  blur: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    minWidth: 60,
  },
  day: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    opacity: 0.85,
  },
  value: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
  },
  pointer: {
    width: 0,
    height: 0,
    marginTop: 3,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0,0,0,0.45)",
  },
});
