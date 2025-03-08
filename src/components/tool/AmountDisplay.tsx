import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface AmountDisplayProps {
    prefixNode?: React.ReactNode;
    amount: number;
    currency: string;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ prefixNode, amount, currency }) => {
    const formattedAmount = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
    }).format(amount);

    return (
        <View style={styles.container}>
            {prefixNode}
            <Text style={styles.amount}>{formattedAmount}</Text>
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
 