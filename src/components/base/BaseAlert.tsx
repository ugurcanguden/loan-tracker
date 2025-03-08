import { Alert, AlertButton } from 'react-native';

interface BaseAlertProps {
    title: string;
    message: string;
    buttons?: AlertButton[];
    options?: {
        cancelable?: boolean;
        onDismiss?: () => void;
    };
}

export const BaseAlert = {
    show: ({
        title,
        message,
        buttons = [{ text: 'OK' }],
        options,
    }: BaseAlertProps) => {
        Alert.alert(title, message, buttons, options);
    },

    success: (title: string, message: string) => {
        Alert.alert(title, message, [{ text: 'OK' }]);
    },

    error: (title: string, message: string) => {
        Alert.alert(title, message, [{ text: 'OK' }]);
    },

    confirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
        Alert.alert(title, message, [
            {
                text: 'Cancel',
                style: 'cancel',
                onPress: onCancel,
            },
            {
                text: 'OK',
                style: 'default',
                onPress: onConfirm,
            },
        ]);
    },
}; 