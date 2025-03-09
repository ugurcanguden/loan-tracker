import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseScrollView } from '../base/BaseScrollView';
import { useThemeContext } from '../../../theme/themeContext';
import { BaseText } from '../base/BaseText';
import { BaseTouchable } from '../base/BaseTouchable';
import { Ionicons } from '@expo/vector-icons';
import { BaseView } from '../base';

export interface PageLayoutProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    backgroundColor?: string;
    padding?: 'none' | 'small' | 'medium' | 'large';
    title?: string;
    showAddButton?: boolean;
    onAddPress?: () => void;
    addButtonIcon?: string;
    addButtonSize?: number;
    rightComponent?: React.ReactNode;
    scrollable?: boolean; // 🔹 İçeriğin kaydırılabilir olup olmadığını belirler
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    header,
    footer,
    children,
    backgroundColor,
    padding = 'medium',
    title,
    showAddButton = false,
    onAddPress,
    addButtonIcon = 'add-circle-sharp',
    addButtonSize = 24,
    rightComponent,
    scrollable = true // 🔹 Varsayılan olarak içerik kaydırılabilir
}) => {
    const { theme } = useThemeContext();

    const renderDefaultHeader = () => {
        if (!title && !showAddButton) return null;

        return (
            <BaseView style={[styles.defaultHeader, { borderBottomColor: theme.colors.border }]}>
                {title && (
                    <BaseText 
                        variant="title" 
                        weight="bold" 
                        style={styles.headerTitle}
                    >
                        {title}
                    </BaseText>
                )}
                {showAddButton && (
                    <BaseTouchable
                        variant="outline"
                        onPress={onAddPress}
                        style={styles.addButton}
                    >
                        <Ionicons
                            name={addButtonIcon as any}
                            size={addButtonSize}
                            color={theme.colors.secondary}
                        />
                    </BaseTouchable>
                )}
                {rightComponent && rightComponent}
            </BaseView>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: backgroundColor || theme.colors.background
        },
        defaultHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            backgroundColor: theme.colors.background,
            zIndex: 1
        },
        headerTitle: {
            flex: 1,
            color: theme.colors.text
        },
        addButton: {
            padding: 5
        },
        content: {
            flex: 1
        },
        footer: {
            backgroundColor: theme.colors.background,
            zIndex: 1
        }
    });

    return (
        <BaseView style={styles.container}>
            {header || renderDefaultHeader()}

            {/* 🔹 İçerik eğer `scrollable` ise `BaseScrollView` içinde gösterilir */}
            {scrollable ? (
                <BaseScrollView style={styles.content} padding={padding} backgroundColor={backgroundColor}>
                    {children}
                </BaseScrollView>
            ) : (
                <BaseView style={styles.content} padding={padding} backgroundColor={backgroundColor}>
                    {children}
                </BaseView>
            )}

            {footer && <View style={styles.footer}>{footer}</View>}
        </BaseView>
    );
};
