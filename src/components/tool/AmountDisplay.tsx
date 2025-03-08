import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '@guden-theme';

export interface AmountDisplayProps {
    prefixNode?: React.ReactNode;
    amount: number;
    currency?: string;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ prefixNode, amount, currency }) => {
    const { theme } = useThemeContext();
    
    const formattedAmount = new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return (
        <View style={styles.container}>
            {prefixNode}
            <Text style={[styles.amount, { color: theme.colors.text }]}>
                {formattedAmount} {currency ?? "₺"}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
        marginRight: 5,
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});
 