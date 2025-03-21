import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  View,
  StyleSheet,
  Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Controller } from 'react-hook-form';
import { useThemeContext } from '@guden-theme';
import { CoreText } from './core-text';
import { useTranslation } from 'react-i18next';
import { format, Locale } from 'date-fns';
import { tr, enUS, de, fr } from 'date-fns/locale';

interface CoreDateInputProps {
  name: string;
  control: any;
  label?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  message?: string;
  placeholder?: string;
}

const localeMap: Record<string, Locale> = {
  'tr-TR': tr,
  'en-US': enUS,
  'de-DE': de,
  'fr-FR': fr,
};

export const CoreDateInput: React.FC<CoreDateInputProps> = ({
  name,
  control,
  label,
  required,
  minDate,
  maxDate,
  message = 'Geçersiz tarih',
  placeholder = 'Tarih seçin',
}) => {
  const { theme } = useThemeContext();
  const { t } = useTranslation();

  const langLocale = t('language.locale') || 'tr-TR';
  const langDateFormat = t('language.dateFormat') || 'dd.MM.yyyy';
  const dateFnsLocale = localeMap[langLocale] || tr;

  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const formatDate = (date: Date) => {
    return format(date, langDateFormat, { locale: dateFnsLocale });
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${message} (Bu alan zorunludur)` : false,
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

          <Pressable
            onPress={() => {
              const initial = value ? new Date(value) : new Date();
              setTempDate(initial);
              setShow(true);
            }}
            style={[
              styles.inputContainer,
              {
                backgroundColor: theme.inputBackground,
                borderColor: error ? theme.error : theme.border,
              },
            ]}
          >
            <CoreText
              style={{ color: value ? theme.inputText : theme.placeholder }}
            >
              {show
                ? formatDate(tempDate)
                : value
                ? formatDate(new Date(value))
                : placeholder}
            </CoreText>
          </Pressable>

          {/* iOS Modal */}
          {Platform.OS === 'ios' && show && (
            <Modal transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View
                  style={[styles.modalContent, { backgroundColor: theme.card }]}
                >
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="spinner"
                    onChange={(
                      event: DateTimePickerEvent,
                      selectedDate?: Date
                    ) => {
                      if (selectedDate) {
                        setTempDate(selectedDate); // sadece geçici değişiklik
                      }
                    }}
                    minimumDate={minDate}
                    maximumDate={maxDate}
                  />
                  <Pressable
                    onPress={() => {
                      onChange(tempDate.toISOString()); // kalıcı kayıt
                      setShow(false);
                    }}
                  >
                    <CoreText
                      variant="label"
                      style={{
                        textAlign: 'center',
                        paddingVertical: 12,
                        color: theme.primary,
                      }}
                    >
                      Tamam
                    </CoreText>
                  </Pressable>
                </View>
              </View>
            </Modal>
          )}

          {/* Android için doğrudan gösterim */}
          {Platform.OS === 'android' && show && (
            <DateTimePicker
              value={value ? new Date(value) : new Date()}
              mode="date"
              display="default"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShow(false);
                if (event.type === 'set' && selectedDate) {
                  onChange(selectedDate.toISOString());
                }
              }}
              minimumDate={minDate}
              maximumDate={maxDate}
            />
          )}

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
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
});
