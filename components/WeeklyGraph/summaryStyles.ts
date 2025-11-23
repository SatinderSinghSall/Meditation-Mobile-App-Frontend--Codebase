import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    marginTop: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,

    backgroundColor: "rgba(28, 28, 28, 0.92)", // SOLID glass-like dark

    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 9,
  },

  header: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  label: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 15,
    fontWeight: "500",
  },

  value: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },

  valueHighlight: {
    color: "#FFD966", // gold highlight
    fontSize: 15,
    fontWeight: "700",
  },

  valueStreak: {
    color: "#FF6A3D", // glowing flame orange
    fontSize: 15,
    fontWeight: "700",
  },
});
