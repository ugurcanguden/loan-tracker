import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BaseText } from '../base/BaseText';
import { BaseView } from '../base/BaseView';
import { useThemeContext } from '@guden-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ConvertDateToString, DateFormat } from 'guden-core';  
import { BasePage } from '@guden-hooks';

interface BaseDatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

export const BaseDatePicker: React.FC<BaseDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
}) => {
  const { theme } = useThemeContext();
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : new Date());
  const { getTranslation } = BasePage();

  const handleConfirm = () => {
    if (selectedDate) {
      onChange(selectedDate.toISOString().split('T')[0]);
    }
    setShow(false); // Sadece bu modal'ı kapat
  };

  const handleCancel = () => {
    setShow(false); // Sadece bu modal'ı kapat
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handlePress = () => setShow(true);
  const handleClear = () => onChange(null);

  const styles = StyleSheet.create({
    container: { marginTop: 4 },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    text: {
      flex: 1,
      color: value ? theme.colors.text : theme.colors.secondary,
    },
    icon: { marginLeft: 8 },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 10,
    },
    modalButton: {
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: 'center',
    },
    confirmButton: { 
      marginRight: 5,
    },
    cancelButton: { 
      marginLeft: 5,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });

  const locale = getTranslation("common.locale");

  return (
    <BaseView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <BaseText style={styles.text}>
          {value 
            ? ConvertDateToString(new Date(value), DateFormat.DDMMYYYYP)
            : placeholder
          }
        </BaseText>
        <MaterialCommunityIcons
          name={value ? "calendar" : "calendar-blank"}
          size={20}
          color={theme.colors.text}
          style={styles.icon}
        />
        {value && (
          <MaterialCommunityIcons
            name="close"
            size={20}
            color={theme.colors.error}
            style={styles.icon}
            onPress={handleClear}
          />
        )}
      </TouchableOpacity>

      {show && Platform.OS === 'ios' ? (
        <Modal
          transparent={true}
          animationType="fade"
          presentationStyle="overFullScreen" // 🔹 Üst modal'ın kapanmasını önler
          onRequestClose={() => {}} // 🔹 Dışarı tıklanınca kapanmayı engeller
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                nativeID='datePicker'
                value={selectedDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={minDate ? new Date(minDate) : undefined}
                maximumDate={maxDate ? new Date(maxDate) : undefined}
                locale={locale}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                  <BaseText>❌</BaseText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirm}>
                  <BaseText >✅</BaseText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        show && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={minDate ? new Date(minDate) : undefined}
            maximumDate={maxDate ? new Date(maxDate) : undefined}
            locale={locale}
          />
        )
      )}
    </BaseView>
  );
};
