import React, { useEffect, useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { useThemeContext } from '@guden-theme';
import { CoreText } from './core-text';
import { useTranslation } from 'react-i18next';

export interface CoreMoneyInputProps {
  name: string;
  control: any;
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  message?: string;
  placeholder?: string;
}

export const CoreMoneyInput: React.FC<CoreMoneyInputProps> = ({
  name,
  control,
  label,
  required,
  min,
  max,
  message = 'Geçersiz tutar',
  placeholder = '0,00',
}) => {
  const { theme } = useThemeContext();
  const { t } = useTranslation();

  const locale = t('language.locale') || 'tr-TR';
  const currency = t('language.currency') || 'TRY';

  // Kullanıcının gördüğü değer
  const [displayValue, setDisplayValue] = useState('');

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const parseInput = (input: string) => {
    const numeric = input.replace(/[^\d]/g, '');
    const floatVal = parseFloat(numeric) / 100;
    return isNaN(floatVal) ? '' : floatVal.toFixed(2);
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${message} (Bu alan zorunludur)` : false,
        min: min ? { value: min, message: `${message} (En az ${min})` } : undefined,
        max: max ? { value: max, message: `${message} (En fazla ${max})` } : undefined,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // Formdaki değer değiştiğinde inputu yeniden formatla
        useEffect(() => {
          if (value) {
            const num = parseFloat(value);
            if (!isNaN(num)) {
              setDisplayValue(formatNumber(num));
            }
          } else {
            setDisplayValue('');
          }
        }, [value]);

        const handleChangeText = (text: string) => {
          const parsed = parseInput(text);
          setDisplayValue(formatNumber(Number(parsed)));
          onChange(parsed);
        };

        return (
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
                styles.inputContainer,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: error ? theme.error : theme.border,
                },
              ]}
            >
              <TextInput
                value={displayValue}
                onChangeText={handleChangeText}
                keyboardType="numeric"
                placeholder={placeholder}
                placeholderTextColor={theme.placeholder}
                style={[styles.input, { color: theme.inputText }]}
              />
            </View>

            {error && (
              <CoreText variant="error" style={{ marginTop: theme.spacing.xs }}>
                {error.message}
              </CoreText>
            )}
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    fontSize: 16,
  },
});
