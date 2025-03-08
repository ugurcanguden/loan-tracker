import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { useThemeContext } from '@guden-theme';

export interface AmountDisplayProps {
    prefixNode?: React.ReactNode;
    amount: number;
    currency?: string;
    style?:any;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ prefixNode, amount, currency ,style}) => {
    const { theme } = useThemeContext();
    
    const formattedAmount = new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return (
        <View style={styles.container}>
            {prefixNode}
            <Text style={[styles.amount, { color: theme.colors.text }, style]}>
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
 