import { CustomHeader } from "@/components/ui/CustomeHeader";
import { COLORS } from "@/constants/colors";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "GeneralSans-Regular": require("../assets/fonts/GeneralSans-Regular.otf"),
    "GeneralSans-Medium": require("../assets/fonts/GeneralSans-Medium.otf"),
    "GeneralSans-Semibold": require("../assets/fonts/GeneralSans-Semibold.otf"),
    "GeneralSans-Bold": require("../assets/fonts/GeneralSans-Bold.otf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          keyboardHandlingEnabled: true,
          headerBackVisible: false,
          contentStyle: { backgroundColor: COLORS.white },
          header: (props) => <CustomHeader {...props} />,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </QueryClientProvider>
  );
}
