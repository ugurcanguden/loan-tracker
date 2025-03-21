import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View } from 'react-native'; 
import { Controller } from 'react-hook-form'; 
import { useThemeContext } from '@guden-theme';
import { CoreText } from './core-text';

export interface CoreInputProps extends TextInputProps {
  name: string;
  control: any;
  label?: string; // 🔹 Yeni: Etiket
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  message?: string;
}

export const CoreInput: React.FC<CoreInputProps> = ({
  name,
  control,
  label,
  required,
  minLength,
  maxLength,
  min,
  max,
  message = 'Geçersiz giriş',
  style,
  ...props
}) => {
  const { theme } = useThemeContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${message} (Bu alan zorunludur)` : false,
        minLength: minLength ? { value: minLength, message: `${message} (En az ${minLength} karakter)` } : undefined,
        maxLength: maxLength ? { value: maxLength, message: `${message} (En fazla ${maxLength} karakter)` } : undefined,
        min: min ? { value: min, message: `${message} (En az ${min})` } : undefined,
        max: max ? { value: max, message: `${message} (En fazla ${max})` } : undefined,
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.wrapper}>
          {label && (
            <CoreText
              variant="label"
              style={{ marginBottom: theme.spacing.xs, color: theme.text }}
            >
              {label}
            </CoreText>
          )}
          <View
            style={[
              styles.container,
              {
                backgroundColor: theme.inputBackground,
                borderColor: error ? theme.error : theme.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.inputText }]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor={theme.placeholder}
              {...props}
            />
          </View>
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
  container: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    fontSize: 16,
  },
});
