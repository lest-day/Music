import { Stack } from "expo-router";
import TrackPlayer from "react-native-track-player";

import { useLoadAssets } from "@/hooks/useLoadAssets";

import "@/assets/global.css";
import { PlaybackService } from "@/constants/PlaybackService";
import { AppProvider } from "@/providers/app";
import { Header } from "@/components/navigation/Header";
import { BackButton } from "@/components/navigation/BackButton";
import { AppModals } from "@/features/modal";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "@/components/error/ErrorBoundary";

export const unstable_settings = {
  // Ensure that reloading on `/settings` keeps a back button present.
  initialRouteName: "(app)/(home)",
};

TrackPlayer.registerPlaybackService(() => PlaybackService);

export default function RootLayout() {
  const { isLoaded } = useLoadAssets();
  if (!isLoaded) return null;
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen
          name="current-track"
          options={{
            animation: "slide_from_bottom",
            header: Header,
            headerTitle: "",
          }}
        />
        <Stack.Screen name="setting" options={{ headerLeft: BackButton }} />
        <Stack.Screen
          name="notification.click"
          options={{ headerShown: false }}
        />
      </Stack>

      <AppModals />
    </AppProvider>
  );
}
