import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import styles from "./styles";
import Tooltip from "./Tooltip";
import {
  BAR_ANIMATION,
  TOOLTIP_ANIMATION,
  LABEL_ANIMATION,
} from "./animations";
import {
  LOW_GRADIENT,
  MEDIUM_GRADIENT,
  HIGH_GRADIENT,
  PERFECT_GRADIENT,
} from "./colors";
import { getGradientForValue, formatMinutes } from "./utils";

const gradients = {
  low: LOW_GRADIENT,
  medium: MEDIUM_GRADIENT,
  high: HIGH_GRADIENT,
  perfect: PERFECT_GRADIENT,
};

type Props = {
  day: string;
  value: number;
  maxValue: number;
  isToday: boolean;
  isPerfect: boolean;
};

const Bar: React.FC<Props> = ({ day, value, maxValue, isToday, isPerfect }) => {
  const height = useSharedValue(0);
  const labelOpacity = useSharedValue(0);
  const labelY = useSharedValue(8);
  const tooltipOpacity = useSharedValue(0);

  const targetHeight = Math.max(6, (value / maxValue) * 90);
  const colorKey = isPerfect ? "perfect" : getGradientForValue(value);

  useEffect(() => {
    height.value = withTiming(targetHeight, BAR_ANIMATION);
    labelOpacity.value = withTiming(1, LABEL_ANIMATION);
    labelY.value = withTiming(0, LABEL_ANIMATION);
  }, [targetHeight]);

  const barStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
    transform: [{ translateY: -6 }],
  }));

  const onPress = () => {
    tooltipOpacity.value = withTiming(1, TOOLTIP_ANIMATION);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      tooltipOpacity.value = withTiming(0, TOOLTIP_ANIMATION);
    }, 1400);
  };

  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Animated.View style={[styles.tooltipContainer, tooltipStyle]}>
        <Tooltip day={day} value={value} />
      </Animated.View>

      <Animated.View style={[styles.barWrapper, barStyle]}>
        <LinearGradient
          colors={gradients[colorKey]}
          style={{ width: "100%", height: "100%" }}
        />

        {isPerfect && (
          <Text
            style={{
              position: "absolute",
              top: -16,
              fontSize: 18,
              color: "#facc15",
            }}
          >
            🔥
          </Text>
        )}
      </Animated.View>

      <Animated.Text
        style={[
          styles.day,
          useAnimatedStyle(() => ({
            opacity: labelOpacity.value,
            transform: [{ translateY: labelY.value }],
          })),
        ]}
      >
        {day}
      </Animated.Text>
    </Pressable>
  );
};

export default Bar;
