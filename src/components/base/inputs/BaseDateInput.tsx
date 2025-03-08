import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { BaseTextInput } from '../BaseTextInput';
import { TextInputProps } from 'react-native';
import { BaseText } from '../BaseText';

interface BaseDateInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    value: Date;
    onChange: (date: Date) => void;
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
        const currentDate = selectedDate || value;
        setShow(Platform.OS === 'ios');
        onChange(currentDate);
    };

    const showDatepicker = () => {
        setShow(true);
    };

    return (
        <>
            <TouchableOpacity onPress={showDatepicker}>
                <BaseTextInput
                    value={formatDate(value)}
                    editable={false}
                    {...props}
                />
            </TouchableOpacity>

            {show && (
                <DateTimePicker
                    value={value}
                    mode={mode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleChange}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                />
            )}
        </>
    );
}; 