import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import styles from "./summaryStyles";

type Props = {
  total: number;
  bestDay: string;
  bestValue: number;
  streak: number;
};

const SummaryCard: React.FC<Props> = ({
  total,
  bestDay,
  bestValue,
  streak,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animate flame if streak >= 3
  useEffect(() => {
    if (streak < 3) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [streak]);

  return (
    <View style={styles.card}>
      <Text style={styles.header}>Weekly Summary</Text>

      {/* Total */}
      <View style={styles.row}>
        <Text style={styles.label}>⏱️ Total</Text>
        <Text style={styles.value}>{total} min</Text>
      </View>

      {/* Best */}
      <View style={styles.row}>
        <Text style={styles.label}>🏆 Best Day</Text>
        <Text style={styles.valueHighlight}>
          {bestDay} — {bestValue} min
        </Text>
      </View>

      {/* Streak */}
      <Animated.View
        style={[styles.row, { transform: [{ scale: pulseAnim }] }]}
      >
        <Text style={styles.label}>🔥 Streak</Text>
        <Text style={[styles.valueStreak]}>
          {streak} {streak === 1 ? "day" : "days"}
        </Text>
      </Animated.View>
    </View>
  );
};

export default SummaryCard;
