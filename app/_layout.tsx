import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { UserStorage } from "@/utils/userStorage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // 1. Check Onboarding Status
  useEffect(() => {
    async function checkOnboarding() {
      try {
        const onboarded = await UserStorage.hasOnboarded();
        setHasOnboarded(onboarded);
      } catch (e) {
        console.error("Failed to check onboarding status", e);
      } finally {
        setIsReady(true);
      }
    }
    checkOnboarding();
  }, []);

  // 2. Hide Splash Screen when fonts and storage check are done
  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  // 3. Protect routes: If not onboarded, redirect to onboarding
  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === "(tabs)";

    if (!hasOnboarded && inAuthGroup) {
      // If user is not onboarded but trying to access tabs, go to onboarding
      router.replace("/onboarding");
    } else if (hasOnboarded && segments[0] === "onboarding") {
      // If user is onboarded but accidentally goes to onboarding, go to tabs
      router.replace("/(tabs)");
    }
  }, [isReady, hasOnboarded, segments, router]);

  if (!loaded || !isReady) {
    return null; // or a custom loading view
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
