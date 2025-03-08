import React from "react";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import { BaseView } from "./BaseView";
import { BaseText } from "./BaseText";

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
  return (
    <BaseView style={[styles.container, style]}>
      {title && (
        <BaseView style={styles.header}>
          <BaseText variant="title" weight="bold" style={styles.title}>
            {title}
          </BaseText>
          {rightContent}
        </BaseView>
      )}
      <BaseView>{children}</BaseView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    flex: 1,
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
