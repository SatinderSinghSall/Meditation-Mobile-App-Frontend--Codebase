import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  // --- CARD ---
  container: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 22,

    // depth
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 14,
  },

  // --- GRID ---
  grid: {
    position: "absolute",
    top: 56,
    left: 18,
    right: 18,
    height: 90,
    justifyContent: "space-between",
    zIndex: 0,
  },

  gridLine: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  // --- BARS ROW ---
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 5,
    paddingTop: 6,
    paddingBottom: 4,
  },

  // --- INDIVIDUAL BAR SLOT ---
  item: {
    width: (width - 140) / 7,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  // --- BAR CORE ---
  barWrapper: {
    width: 20,
    borderRadius: 14,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "rgba(255,255,255,0.04)",

    // subtle neon glow baseline
    shadowColor: "#ff6a5c",
    shadowRadius: 3,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
  },

  barFill: {
    width: "100%",
    height: "100%",
    borderRadius: 14,
  },

  // --- LABEL ---
  day: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },

  // --- PREMIUM TOOLTIP ---
  tooltipContainer: {
    position: "absolute",
    top: -52,
    zIndex: 999,
    alignItems: "center",
  },

  tooltipGlass: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,

    backgroundColor: "rgba(20,20,20,0.4)",
    backdropFilter: "blur(12px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  tooltipDay: {
    fontSize: 11,
    fontWeight: "600",
    color: "#E9E9E9",
    marginBottom: 2,
  },

  tooltipValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFD27F",
  },

  // Flame above perfect streak
  perfectFlame: {
    marginBottom: 3,
    fontSize: 18,
    color: "#FFC431",
    textShadowColor: "rgba(255,200,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
});
