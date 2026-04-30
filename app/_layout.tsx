// Initialize i18n before any component renders.
import "@shared/i18n/i18n";

import { registerServiceWorker } from "@shared/pwa/registerServiceWorker";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useCacheStore } from "@features/offline-cache";
import { ThemeProvider, useTheme, useThemeToggle } from "@shared/design-system";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function AppNavigator() {
  const theme = useTheme();
  const hydrate = useCacheStore((s) => s.hydrate);
  const { colorScheme } = useThemeToggle();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.bgBase },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="modules/[id]" />
        <Stack.Screen
          name="player/[questionId]"
          options={{ animation: "fade", presentation: "fullScreenModal" }}
        />
        <Stack.Screen
          name="showcase"
          options={{ animation: "fade", presentation: "fullScreenModal" }}
        />
      </Stack>
    </>
  );
}
