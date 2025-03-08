import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseText } from '../base/BaseText';
import { PageLayout } from './PageLayout';
import { useThemeContext } from '../../../theme/themeContext';

export const ExampleScreen = () => {
    const { theme } = useThemeContext();

    const Header = () => (
        <View style={styles.header}>
            <BaseText variant="title" weight="bold">Header</BaseText>
        </View>
    );

    const Footer = () => (
        <View style={styles.footer}>
            <BaseText variant="body">Footer</BaseText>
        </View>
    );

    const styles = StyleSheet.create({
        header: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        footer: {
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
        contentItem: {
            padding: 16,
            marginBottom: 16,
            backgroundColor: theme.colors.card,
            borderRadius: 8,
        }
    });

    return (
        <PageLayout
            header={<Header />}
            footer={<Footer />}
            padding="medium"
        >
            {/* Example content items */}
            {Array.from({ length: 20 }).map((_, index) => (
                <View key={index} style={styles.contentItem}>
                    <BaseText>Content Item {index + 1}</BaseText>
                </View>
            ))}
        </PageLayout>
    );
}; 