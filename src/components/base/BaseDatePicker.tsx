import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BaseText } from '../base/BaseText';
import { BaseView } from '../base/BaseView';
import { useThemeContext } from '@guden-theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ConvertDateToString, DateFormat } from 'guden-core';

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

  const handleChange = (_: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate.toISOString().split('T')[0]);
    }
  };

  const handlePress = () => {
    setShow(true);
  };

  const handleClear = () => {
    onChange(null);
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 4,
    },
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
    icon: {
      marginLeft: 8,
    },
  });

  return (
    <BaseView style={styles.container}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handlePress}
      >
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

      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          minimumDate={minDate ? new Date(minDate) : undefined}
          maximumDate={maxDate ? new Date(maxDate) : undefined}
        />
      )}
    </BaseView>
  );
}; 