import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeContext } from '../../../theme/themeContext';
import { BaseView } from '../base';
import { BaseText } from '../base/BaseText';
import { BaseTouchable } from '../base/BaseTouchable';

export interface ActionItem {
    icon: string;
    onClick: () => void;
    text: string;
    style?: string;
}

export interface PageLayoutProps {
    header?: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
    backgroundColor?: string;
    title?: string;
    showAddButton?: boolean;
    onAddPress?: () => void;
    addButtonIcon?: string;
    addButtonSize?: number;
    rightComponent?: React.ReactNode;
    actions?: ActionItem[];
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    header,
    footer,
    children,
    backgroundColor,
    title,
    showAddButton = false,
    onAddPress,
    addButtonIcon = 'add-circle-sharp',
    addButtonSize = 24,
    rightComponent,
    actions
}) => {
    const { theme } = useThemeContext();
    const [isActionsMenuVisible, setIsActionsMenuVisible] = useState(false);

    const renderDefaultHeader = () => {
        if (!title && !showAddButton && !actions) return null;

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
                <View style={styles.headerActions}>
                    {showAddButton && (
                        <BaseTouchable
                            variant="background"
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
                    {actions && (
                        <View style={styles.actionsMenu}>
                            <TouchableOpacity onPress={() => setIsActionsMenuVisible(!isActionsMenuVisible)}>
                                <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            {isActionsMenuVisible && (
                                <View style={styles.actionsList} >
                                    {actions.map((action, index) => (
                                        <TouchableOpacity key={index} style={styles.actionItem} onPress={action.onClick}>
                                            <Ionicons name={action.icon as any} size={24} color={theme.colors.text} />
                                            {(action.text?.length > 0) && <BaseText style={styles.actionText}>{action.text}</BaseText>}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                </View>

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
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8 // ✅ Butonlar arası boşluk
        },
        actionsMenu: {
            position: 'relative',
        },
        actionsList: {
            position: 'absolute',
            top: 24,
            right: 1,
            backgroundColor: theme.colors.background,
            borderRadius: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
            elevation: 2,
            zIndex: 2,
            minWidth: 150, // Menünün minimum genişliği
            maxWidth: 200, // Menünün maksimum genişliği 
        },
        actionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 8,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        actionText: {
            marginLeft: 8,
            color: theme.colors.text,
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
            <SafeAreaView style={styles.content}>{children}</SafeAreaView>
            {footer && <View style={styles.footer}>{footer}</View>}
        </BaseView>
    );
};