import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { createCommonStyles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { spacing, shadows, typography } from '../../../theme/theme';
import { useTranslation } from 'react-i18next';

interface SettingsButtonProps {
    onPress?: () => void;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ onPress }) => {
    const { theme, isDarkMode, setIsDarkMode } = useThemeContext();
    const commonStyles = createCommonStyles(theme);
    const { t } = useTranslation();

    const handleThemeToggle = () => {
        setIsDarkMode(!isDarkMode);
    };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: spacing.md,
            backgroundColor: theme.card,
            borderRadius: spacing.md,
            marginBottom: spacing.sm,
            ...shadows.sm,
        },
        leftContent: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDarkMode ? theme.background : theme.primary + '20',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
        },
        contentContainer: {
            flex: 1,
        },
        title: {
            color: theme.text,
            fontSize: typography.fontSizes.md,
            fontWeight: typography.fontWeights.semibold,
            marginBottom: spacing.xs / 2,
        },
        description: {
            color: theme.secondary,
            fontSize: typography.fontSizes.sm,
        },
        toggleContainer: {
            marginLeft: spacing.md,
        },
    });

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            <View style={styles.container}>
                <View style={styles.leftContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons 
                            name={isDarkMode ? 'moon' : 'sunny'} 
                            size={24} 
                            color={isDarkMode ? theme.text : theme.primary} 
                        />
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.title}>
                            {t('settings.theme')}
                        </Text>
                        <Text style={styles.description}>
                            {isDarkMode ? t('settings.dark_mode') : t('settings.light_mode')}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity 
                    onPress={handleThemeToggle} 
                    style={styles.toggleContainer}
                    activeOpacity={0.7}
                >
                    <Ionicons 
                        name={isDarkMode ? 'toggle' : 'toggle-outline'} 
                        size={36} 
                        color={isDarkMode ? theme.primary : theme.secondary} 
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}; 