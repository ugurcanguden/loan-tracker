import { useThemeContext } from "@guden-theme";
import React from "react";
import { Platform, SafeAreaView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { BaseText } from "./BaseText";
import { BaseView } from "./BaseView";

export interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  padding?: "none" | "small" | "medium" | "large";
  style?: StyleProp<ViewStyle>;
  rightContent?: React.ReactNode;
}

export function PageLayout({
  children,
  title,
  padding = "medium",
  style,
  rightContent,
}: PageLayoutProps) {
  const { theme } = useThemeContext();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <BaseView style={[styles.container, style]}>
        {title && (
          <BaseView style={styles.header}>
            <BaseText variant="title" weight="bold" style={styles.title}>
              {title}
            </BaseText>
            <BaseView style={styles.rightContent}>
              {rightContent}
            </BaseView>
          </BaseView>
        )}
        <BaseView style={[
          styles.content,
          padding === "small" && styles.paddingSmall,
          padding === "medium" && styles.paddingMedium,
          padding === "large" && styles.paddingLarge,
        ]}>
          {children}
        </BaseView>
      </BaseView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...Platform.select({
      ios: {
        paddingTop: 8,
      },
      android: {
        paddingTop: 16,
      },
    }),
  },
  title: {
    flex: 1,
    marginRight: 16,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  paddingSmall: {
    padding: 8,
  },
  paddingMedium: {
    padding: 16,
  },
  paddingLarge: {
    padding: 24,
  },
});
