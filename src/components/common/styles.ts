import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme, borderRadius, shadows, spacing, typography } from '../../../theme/theme';

interface CommonStylesType {
    container: ViewStyle;
    card: ViewStyle;
    row: ViewStyle;
    spaceBetween: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    text: TextStyle;
    label: TextStyle;
    input: ViewStyle & TextStyle;
    inputError: ViewStyle;
    errorText: TextStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    secondaryButton: ViewStyle;
    outlineButton: ViewStyle;
    outlineButtonText: TextStyle;
    disabledButton: ViewStyle;
    listItem: ViewStyle;
    listItemTitle: TextStyle;
    listItemSubtitle: TextStyle;
    badge: ViewStyle;
    badgeText: TextStyle;
    successBadge: ViewStyle;
    warningBadge: ViewStyle;
    errorBadge: ViewStyle;
    infoBadge: ViewStyle;
    shadow: ViewStyle;
    marginBottom: ViewStyle;
    padding: ViewStyle;
}

export const createCommonStyles = (theme: Theme): CommonStylesType => {
    const styles = StyleSheet.create({
        // Container styles
        container: {
            flex: 1,
            backgroundColor: theme.background,
            padding: spacing.md,
        },
        card: {
            backgroundColor: theme.card,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
            marginVertical: spacing.sm,
            ...shadows.md,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        spaceBetween: {
            justifyContent: 'space-between',
        },

        // Text styles
        title: {
            fontSize: typography.fontSizes['2xl'],
            fontWeight: typography.fontWeights.bold,
            color: theme.text,
            marginBottom: spacing.md,
        },
        subtitle: {
            fontSize: typography.fontSizes.xl,
            fontWeight: typography.fontWeights.semibold,
            color: theme.text,
            marginBottom: spacing.sm,
        },
        text: {
            fontSize: typography.fontSizes.md,
            color: theme.text,
            lineHeight: typography.lineHeights.normal,
        },
        label: {
            fontSize: typography.fontSizes.sm,
            fontWeight: typography.fontWeights.medium,
            color: theme.text,
            marginBottom: spacing.xs,
        },

        // Form styles
        input: {
            backgroundColor: theme.card,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            color: theme.text,
            fontSize: typography.fontSizes.md,
            marginBottom: spacing.md,
        },
        inputError: {
            borderColor: theme.error,
        },
        errorText: {
            color: theme.error,
            fontSize: typography.fontSizes.sm,
            marginTop: -spacing.sm,
            marginBottom: spacing.sm,
        },

        // Button styles
        button: {
            backgroundColor: theme.primary,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.sm,
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: typography.fontSizes.md,
            fontWeight: typography.fontWeights.semibold,
        },
        secondaryButton: {
            backgroundColor: theme.secondary,
        },
        outlineButton: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.primary,
        },
        outlineButtonText: {
            color: theme.primary,
        },
        disabledButton: {
            backgroundColor: theme.disabled,
            opacity: 0.7,
        },

        // List styles
        listItem: {
            backgroundColor: theme.card,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginVertical: spacing.xs,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...shadows.sm,
        },
        listItemTitle: {
            fontSize: typography.fontSizes.md,
            fontWeight: typography.fontWeights.medium,
            color: theme.text,
        },
        listItemSubtitle: {
            fontSize: typography.fontSizes.sm,
            color: theme.secondary,
            marginTop: spacing.xs,
        },

        // Badge styles
        badge: {
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            borderRadius: borderRadius.full,
            alignSelf: 'flex-start',
        },
        badgeText: {
            fontSize: typography.fontSizes.xs,
            fontWeight: typography.fontWeights.medium,
            color: '#FFFFFF',
        },
        successBadge: {
            backgroundColor: theme.success,
        },
        warningBadge: {
            backgroundColor: theme.warning,
        },
        errorBadge: {
            backgroundColor: theme.error,
        },
        infoBadge: {
            backgroundColor: theme.info,
        },

        // Utility styles
        shadow: shadows.md,
        marginBottom: {
            marginBottom: spacing.md,
        },
        padding: {
            padding: spacing.md,
        },
    });

    return styles as CommonStylesType;
}; 