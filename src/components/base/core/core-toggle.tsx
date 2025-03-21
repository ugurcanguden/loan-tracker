import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { useThemeContext } from '@guden-theme';
import { CoreText } from './core-text';

interface CoreToggleProps {
  name: string;
  control: any;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  message?: string;
}

export const CoreToggle: React.FC<CoreToggleProps> = ({
  name,
  control,
  label,
  disabled = false,
  required,
  message = 'Bu alan zorunludur',
}) => {
  const { theme } = useThemeContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${message}` : false,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          {label && (
            <CoreText
              variant="label"
              style={{ marginBottom: theme.spacing.xs, color: theme.text }}
            >
              {label}
            </CoreText>
          )}

          <Switch
            value={!!value}
            onValueChange={onChange}
            disabled={disabled}
            thumbColor={value ? theme.primary : theme.border}
            trackColor={{ false: theme.border, true: theme.primary }}
          />

          {error && (
            <CoreText variant="error" style={{ marginTop: theme.spacing.xs }}>
              {error.message}
            </CoreText>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
});
