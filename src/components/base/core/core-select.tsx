import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { useThemeContext } from '@guden-theme';
import { CoreText } from './core-text';

export interface CoreSelectOption {
  label: string;
  value: string | number;
}

export interface CoreSelectProps {
  name: string;
  control: any;
  label?: string;
  options: CoreSelectOption[];
  required?: boolean;
  message?: string;
  placeholder?: string;
}

export const CoreSelect: React.FC<CoreSelectProps> = ({
  name,
  control,
  label,
  options,
  required,
  message = 'Geçersiz seçim',
  placeholder = 'Seçiniz',
}) => {
  const { theme } = useThemeContext();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? `${message} (Bu alan zorunludur)` : false,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selected = options.find((opt) => opt.value === value);

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

            <Pressable
              onPress={() => setModalVisible(true)}
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: error ? theme.error : theme.border,
                },
              ]}
            >
              <CoreText
                style={{
                  color: selected ? theme.inputText : theme.placeholder,
                }}
              >
                {selected ? selected.label : placeholder}
              </CoreText>
            </Pressable>

            {error && (
              <CoreText variant="error" style={{ marginTop: theme.spacing.xs }}>
                {error.message}
              </CoreText>
            )}

            <Modal visible={modalVisible} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View
                  style={[
                    styles.modalContent,
                    { backgroundColor: theme.card },
                  ]}
                >
                  <FlatList
                    data={options}
                    keyExtractor={(item) => item.value.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          onChange(item.value);
                          setModalVisible(false);
                        }}
                        style={styles.option}
                      >
                        <CoreText style={{ color: theme.text }}>
                          {item.label}
                        </CoreText>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <CoreText
                      variant="label"
                      style={{
                        textAlign: 'center',
                        color: theme.primary,
                        paddingVertical: 12,
                      }}
                    >
                      Kapat
                    </CoreText>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
    maxHeight: '50%',
    padding: 16,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
});
