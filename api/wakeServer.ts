import Constants from "expo-constants";

const API_BASE = Constants.expoConfig?.extra?.API_BASE;

export async function wakeServer() {
  try {
    // Hit a very lightweight endpoint
    await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Send empty credentials; backend will ignore
      body: JSON.stringify({ email: "", password: "" }),
    });
  } catch (err) {
    // Ignore errors — this is just to wake the backend
    console.log("⏳ Waking up Render server...");
  }
}
