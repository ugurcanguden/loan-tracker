import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, TextInputProps, TouchableOpacity, View } from 'react-native';
import { BaseTextInput } from '../BaseTextInput';

export interface BaseDateInputProps extends Omit<TextInputProps, 'onChange' | 'value'> {
    value?: string | Date;
    onChange?: (data: { formatted: string; raw: Date }) => void; // Hem formatlı hem Date döner
    format?: string;
    mode?: 'date' | 'time' | 'datetime';
    minimumDate?: Date;
    maximumDate?: Date;
}

export const BaseDateInput: React.FC<BaseDateInputProps> = ({
    value,
    onChange,
    format = 'dd/MM/yyyy',
    mode = 'date',
    minimumDate,
    maximumDate,
    ...props
}) => {
    const [show, setShow] = useState(false);

    const parseDate = (date: string | Date): Date => {
        return typeof date === 'string' ? new Date(date) : date;
    };

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        switch (format.toLowerCase()) {
            case 'mm/dd/yyyy':
                return `${month}/${day}/${year}`;
            case 'yyyy-mm-dd':
                return `${year}-${month}-${day}`;
            case 'dd.mm.yyyy':
                return `${day}.${month}.${year}`;
            default:
                return `${day}/${month}/${year}`;
        }
    };

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) {
            onChange?.({ formatted: formatDate(selectedDate), raw: selectedDate });
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setShow(true)}>
                <BaseTextInput
                    value={value ? formatDate(parseDate(value)) : ''}
                    editable={false}
                    {...props}
                />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={value ? parseDate(value) : new Date()}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    onChange={handleChange}
                />
            )}
        </View>
    );
};
