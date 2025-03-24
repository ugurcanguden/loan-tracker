import { CoreNotification, LoadingSpinner } from "@guden-components";
import { GlobalStateProvider, LoadingProvider, NotificationProvider } from "@guden-context";
import { BottomTabNavigator, MenuLayout } from "@guden-layout";
import { ThemeProvider } from "@guden-theme";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import "react-native-reanimated";
import i18n from "../locales/i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  SplashScreen.preventAutoHideAsync(); // splash otomatik kapanmaz


  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
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
              <MenuLayout>
                <BottomTabNavigator />
              </MenuLayout>
              <LoadingSpinner />
            </NotificationProvider>
          </GlobalStateProvider>
        </I18nextProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}
