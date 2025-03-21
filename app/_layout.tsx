import { CoreNotification, LoadingSpinner } from "@guden-components";
import { GlobalStateProvider, LoadingProvider, NotificationProvider } from "@guden-context";
import { BottomTabNavigator } from "@guden-layout";
import { ThemeProvider } from "@guden-theme";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import "react-native-reanimated";
import i18n from "../locales/i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <LoadingProvider>
        <I18nextProvider i18n={i18n}>
          <GlobalStateProvider>
            <NotificationProvider>
              <CoreNotification />
              <BottomTabNavigator />
              <LoadingSpinner />
            </NotificationProvider>
          </GlobalStateProvider>
        </I18nextProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
