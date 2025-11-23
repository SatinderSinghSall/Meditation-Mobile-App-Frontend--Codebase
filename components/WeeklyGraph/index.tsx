import React from "react";
import { View, Text } from "react-native";
import styles from "./styles";
import Bar from "./Bar";
import SummaryCard from "./SummaryCard";
import { getBestDay, getTotalMinutes, getWeeklyStreak } from "./utils";

type DayDatum = {
  day: string;
  value: number;
};

type Props = {
  data: DayDatum[];
};

const WeeklyGraph: React.FC<Props> = ({ data }) => {
  // Always use safe fallback
  const safeData =
    data && data.length > 0
      ? data
      : [
          { day: "S", value: 0 },
          { day: "M", value: 0 },
          { day: "T", value: 0 },
          { day: "W", value: 0 },
          { day: "T", value: 0 },
          { day: "F", value: 0 },
          { day: "S", value: 0 },
        ];

  // scale
  const max = Math.max(...safeData.map((d) => d.value), 1);

  // get safe best object { day, value }
  const best = getBestDay(safeData);

  // streak = count of days >0 in order
  const streak = getWeeklyStreak(safeData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week</Text>

      {/* Grid lines */}
      <View style={styles.grid}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.gridLine} />
        ))}
      </View>

      {/* Bars */}
      <View style={styles.row}>
        {safeData.map((item, idx) => (
          <Bar
            key={idx}
            day={item.day}
            value={item.value}
            maxValue={max}
            isToday={idx === new Date().getDay()}
            isPerfect={streak >= safeData.length}
          />
        ))}
      </View>

      {/* Summary */}
      <SummaryCard
        total={getTotalMinutes(safeData)}
        bestDay={best.day}
        bestValue={best.value}
        streak={streak}
      />
    </View>
  );
};

export default WeeklyGraph;
