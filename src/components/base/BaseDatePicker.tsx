import React, { useState, useRef } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Kapatma işlemi için ref
  const isScrolling = useRef(false); // Kullanıcı kaydırıyor mu?
  const { getTranslation } = BasePage();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }

    if (selectedDate) {
      onChange(selectedDate.toISOString().split('T')[0]);
    }
 

    // iOS için kapanmayı geciktirme
    if (Platform.OS === 'ios') {
      timeoutRef.current = setTimeout(() => {
        console.log("ios2")
        setShow(false);
      }, 2000);
    } else {
      setShow(false);
    }
  };

  const handlePress = () => {
    // Eğer daha önce açılma süresi dolmadan tekrar açılmışsa eski timeout'u iptal et
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShow(true);
  };

  const handleClear = () => onChange(null);

  const handleTouchStart = () => {
    isScrolling.current = true; // Kullanıcı kaydırmaya başladı
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Kapanma işlemini durdur
    }
  };

  const handleTouchEnd = () => {
    isScrolling.current = false; // Kaydırma bitti
  };

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

      {show && (
        <View
          onTouchStart={handleTouchStart} // Kullanıcı kaydırmaya başlarsa
          onTouchEnd={handleTouchEnd} // Kullanıcı kaydırmayı bırakırsa
        >
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            minimumDate={minDate ? new Date(minDate) : undefined}
            maximumDate={maxDate ? new Date(maxDate) : undefined}
            locale={locale}
          />
        </View>
      )}
    </BaseView>
  );
};
