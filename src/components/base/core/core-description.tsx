import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeContext } from '@guden-theme';
import { CoreText } from './core-text';

export interface DescriptionItem {
  label: string;
  value: string | number | React.ReactNode;
}

interface CoreDescriptionProps {
  title?: string;
  data: DescriptionItem[];
  columns?: number;
  bordered?: boolean;
  labelStyle?: object;
  valueStyle?: object;
}

export const CoreDescription: React.FC<CoreDescriptionProps> = ({
  title,
  data,
  columns = 2,
  bordered = false,
  labelStyle,
  valueStyle,
}) => {
  const { theme } = useThemeContext();
  const rows = [];

  for (let i = 0; i < data.length; i += columns) {
    const rowItems = data.slice(i, i + columns);
    rows.push(rowItems);
  }

  return (
    <View style={styles.container}>
      {title && (
        <CoreText
          variant="title"
          weight="bold"
          style={{ marginBottom: theme.spacing.sm }}
        >
          {title}
        </CoreText>
      )}

      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((item, colIndex) => (
            <View
              key={colIndex}
              style={[
                styles.item,
                bordered && {
                  borderWidth: 1,
                  borderColor: theme.border,
                },
                { flex: 1 / columns },
              ]}
            >
              <CoreText
                variant="label"
                style={[{ color: theme.placeholder, marginBottom: 4 }, labelStyle]}
              >
                {item.label}
              </CoreText>
              <CoreText
                style={[{ color: theme.text }, valueStyle]}
              >
                {item.value}
              </CoreText>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  item: {
    padding: 8,
    borderRadius: 6,
  },
});
