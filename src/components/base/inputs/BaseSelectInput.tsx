import React, { useState } from 'react';
import { StyleSheet, View, Modal, FlatList, TouchableOpacity, ViewStyle } from 'react-native';
import { BaseTextInput } from '../BaseTextInput';
import { BaseText } from '../BaseText';
import { BaseTouchable } from '../BaseTouchable';
import { useThemeContext } from '../../../../theme/themeContext';
import { spacing, shadows } from '../../../../theme/theme';
import { Ionicons } from '@expo/vector-icons';

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface BaseSelectInputProps {
    value?: string | number;
    options: SelectOption[];
    onChange: (option: SelectOption) => void;
    placeholder?: string;
    searchable?: boolean;
    multiple?: boolean;
    error?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export const BaseSelectInput: React.FC<BaseSelectInputProps> = ({
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    searchable = false,
    multiple = false,
    error = false,
    disabled = false,
    style,
}) => {
    const { theme } = useThemeContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedOption = options.find(option => option.value === value);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const styles = StyleSheet.create({
        container: {
            position: 'relative',
        },
        input: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.card,
            borderRadius: spacing.sm,
            borderWidth: 1,
            borderColor: error ? theme.error : theme.border,
            padding: spacing.md,
            opacity: disabled ? 0.7 : 1,
        },
        modalContainer: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            padding: spacing.md,
        },
        modalContent: {
            backgroundColor: theme.card,
            borderRadius: spacing.md,
            maxHeight: '80%',
            ...shadows.md,
        },
        searchContainer: {
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        optionContainer: {
            padding: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
        },
        selectedOption: {
            backgroundColor: theme.primary + '10',
        },
        footer: {
            padding: spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.border,
        },
        valueText: {
            color: selectedOption ? theme.text : theme.placeholder,
            flex: 1,
        },
        icon: {
            marginLeft: spacing.sm,
        },
    });

    const handleSelect = (option: SelectOption) => {
        onChange(option);
        if (!multiple) {
            setModalVisible(false);
        }
    };

    const renderOption = ({ item }: { item: SelectOption }) => (
        <TouchableOpacity
            style={[
                styles.optionContainer,
                item.value === value && styles.selectedOption,
            ]}
            onPress={() => handleSelect(item)}
        >
            <BaseText>{item.label}</BaseText>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity
                onPress={() => !disabled && setModalVisible(true)}
                style={styles.input}
                disabled={disabled}
            >
                <BaseText style={styles.valueText}>
                    {selectedOption?.label || placeholder}
                </BaseText>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color={theme.secondary}
                    style={styles.icon}
                />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {searchable && (
                            <View style={styles.searchContainer}>
                                <BaseTextInput
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholder="Search..."
                                    autoFocus
                                />
                            </View>
                        )}

                        <FlatList
                            data={filteredOptions}
                            renderItem={renderOption}
                            keyExtractor={item => item.value.toString()}
                        />

                        <View style={styles.footer}>
                            <BaseTouchable
                                onPress={() => setModalVisible(false)}
                                variant="primary"
                            >
                                <BaseText style={{ color: '#FFFFFF' }}>Close</BaseText>
                            </BaseTouchable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}; 