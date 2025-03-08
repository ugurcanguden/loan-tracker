import { TextStyle, ViewStyle } from 'react-native';

export interface ThemeColors {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    card: string;
    border: string;
    placeholder: string;
    disabled: string;
    link: string;
}

export interface Theme extends ThemeColors {
    colors: ThemeColors;
}

export const lightTheme: Theme = {
    background: '#F8F9FA',
    text: '#212529',
    primary: '#0D6EFD',
    secondary: '#6C757D',
    success: '#198754',
    error: '#DC3545',
    warning: '#FFC107',
    info: '#0DCAF0',
    card: '#FFFFFF',
    border: '#DEE2E6',
    placeholder: '#6C757D',
    disabled: '#E9ECEF',
    link: '#0D6EFD',
    colors: {
        background: '#F8F9FA',
        text: '#212529',
        primary: '#0D6EFD',
        secondary: '#6C757D',
        success: '#198754',
        error: '#DC3545',
        warning: '#FFC107',
        info: '#0DCAF0',
        card: '#FFFFFF',
        border: '#DEE2E6',
        placeholder: '#6C757D',
        disabled: '#E9ECEF',
        link: '#0D6EFD',
    }
};

export const darkTheme: Theme = {
    background: '#212529',
    text: '#F8F9FA',
    primary: '#0D6EFD',
    secondary: '#6C757D',
    success: '#198754',
    error: '#DC3545',
    warning: '#FFC107',
    info: '#0DCAF0',
    card: '#343A40',
    border: '#495057',
    placeholder: '#ADB5BD',
    disabled: '#343A40',
    link: '#0D6EFD',
    colors: {
        background: '#212529',
        text: '#F8F9FA',
        primary: '#0D6EFD',
        secondary: '#6C757D',
        success: '#198754',
        error: '#DC3545',
        warning: '#FFC107',
        info: '#0DCAF0',
        card: '#343A40',
        border: '#495057',
        placeholder: '#ADB5BD',
        disabled: '#343A40',
        link: '#0D6EFD',
    }
};

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    } as ViewStyle,
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    } as ViewStyle,
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    } as ViewStyle,
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const typography = {
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
    },
    fontWeights: {
        normal: '400' as TextStyle['fontWeight'],
        medium: '500' as TextStyle['fontWeight'],
        semibold: '600' as TextStyle['fontWeight'],
        bold: '700' as TextStyle['fontWeight'],
    },
    lineHeights: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
};
  