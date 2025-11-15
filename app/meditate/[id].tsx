import AppGradient from "@/components/AppGradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import CustomButton from "@/components/CustomButton";

import MEDITATION_IMAGES from "@/constants/meditation-images";
import { TimerContext } from "@/context/TimerContext";
import { MEDITATION_DATA, AUDIO_FILES } from "@/constants/MeditationData";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMeditation } from "@/api/meditationApi";

const Page = () => {
  const { id } = useLocalSearchParams();

  const {
    duration: secondsRemaining,
    setDuration,
    initialDuration,
    setInitialDuration,
  } = useContext(TimerContext);

  const [isMeditating, setMeditating] = useState(false);
  const [audioSound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlayingAudio, setPlayingAudio] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const handleSessionComplete = async () => {
    try {
      if (sessionSaved) return;
      setSessionSaved(true);

      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const minutes = Math.max(1, Math.round(initialDuration / 60));

      const medId = String(id);
      const medTitle = MEDITATION_DATA[Number(id) - 1]?.title || null;

      console.log("Saving meditation:", minutes, medId, medTitle);

      await addMeditation(minutes, medId, medTitle, token);
      console.log("Meditation saved to backend!");

      setDuration(initialDuration);
    } catch (err) {
      console.log("Error saving meditation:", err);
    }
  };

  // Timer
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;

    if (secondsRemaining === 0) {
      if (isPlayingAudio) audioSound?.pauseAsync().catch(() => {});
      setMeditating(false);
      setPlayingAudio(false);

      handleSessionComplete();
      return;
    }

    if (isMeditating) {
      timerId = setTimeout(() => setDuration(secondsRemaining - 1), 1000);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [secondsRemaining, isMeditating]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioSound) {
        audioSound.unloadAsync().catch(() => {});
      }
      setSessionSaved(false);
    };
  }, [audioSound]);

  // Initialize audio with safe checks + logs
  const initializeSound = async (): Promise<Audio.Sound | null> => {
    try {
      const audioFileName = MEDITATION_DATA[Number(id) - 1]?.audio;
      if (!audioFileName) {
        console.warn("No audio filename for meditation id", id);
        return null;
      }

      const asset = AUDIO_FILES[audioFileName];
      if (!asset) {
        console.error("AUDIO_FILES missing entry for:", audioFileName);
        return null;
      }

      // createAsync accepts the require() result
      const result = await Audio.Sound.createAsync(asset, {
        shouldPlay: false,
      });
      const { sound } = result;
      setSound(sound);
      return sound;
    } catch (err) {
      console.error("Error initializing sound:", err);
      return null;
    }
  };

  const togglePlayPause = async () => {
    try {
      const sound = audioSound ?? (await initializeSound());
      if (!sound) return;

      const status = await sound.getStatusAsync();
      if (status.isLoaded && !isPlayingAudio) {
        await sound.playAsync();
        setPlayingAudio(true);
      } else {
        await sound.pauseAsync();
        setPlayingAudio(false);
      }
    } catch (err) {
      console.error("Error togglePlayPause:", err);
    }
  };

  async function toggleMeditationSessionStatus() {
    if (secondsRemaining === 0) {
      setDuration(initialDuration);
      setSessionSaved(false);
    }

    setMeditating((p) => !p);
    await togglePlayPause();
  }

  const handleAdjustDuration = () => {
    if (isMeditating) toggleMeditationSessionStatus();
    router.push("/(modal)/adjust-meditation-duration");
  };

  const formattedTimeMinutes = String(
    Math.floor(secondsRemaining / 60)
  ).padStart(2, "0");
  const formattedTimeSeconds = String(secondsRemaining % 60).padStart(2, "0");

  return (
    <View className="flex-1">
      <ImageBackground
        source={MEDITATION_IMAGES[Number(id) - 1]}
        resizeMode="cover"
        className="flex-1"
      >
        <AppGradient colors={["transparent", "rgba(0,0,0,0.8)"]}>
          <Pressable
            onPress={() => router.back()}
            className="absolute top-16 left-6 z-10"
          >
            <AntDesign name="left" size={40} color="white" />
          </Pressable>

          <View className="flex-1 justify-center">
            <View className="mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center">
              <Text className="text-4xl text-blue-800 font-rmono">
                {formattedTimeMinutes}.{formattedTimeSeconds}
              </Text>
            </View>
          </View>

          <View className="mb-5">
            <CustomButton
              title="Adjust duration"
              onPress={handleAdjustDuration}
            />
            <CustomButton
              title={isMeditating ? "Stop" : "Start Meditation"}
              onPress={toggleMeditationSessionStatus}
              containerStyles="mt-4"
            />
          </View>
        </AppGradient>
      </ImageBackground>
    </View>
  );
};

export default Page;
