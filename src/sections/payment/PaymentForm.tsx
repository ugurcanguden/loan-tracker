import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Switch, Alert } from 'react-native';
import { useThemeContext } from '@guden-theme';
import { PaymentService } from '@guden-services';
import { Payment } from '@guden-models';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BasePage } from '@guden-hooks';
export interface PaymentFormProps {
    onClosed: () => void;
}
export default function PaymentForm({onClosed}: PaymentFormProps) {
    const { theme } = useThemeContext();
    const { addPayment } = PaymentService();
    const { t } = useTranslation(); 
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [startDate, setStartDate] = useState(new Date());
    const [isRecurring, setIsRecurring] = useState(false);
    const [installments, setInstallments] = useState<number>(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const {getTranslation}= BasePage();

    const onSave = () => {
        if (!name || amount <= 0 || (isRecurring && installments <= 0)) {
            Alert.alert(getTranslation("common.error"), getTranslation("common.mandatoryFields"));
            return;
        }

        const payment: Payment = {
            name,
            amount,
            startDate: startDate.toISOString(),
            isRecurring: isRecurring ? 1 : 0,
            installments: isRecurring ? installments : 1,
        };
        addPayment(payment);
        Alert.alert(getTranslation("common.success"));
        onClosed();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{getTranslation("payment.name")}</Text>
            <TextInput
                style={[
                    styles.input,
                    { borderColor: !name ? 'red' : theme.colors.primary }
                ]}
                value={name}
                onChangeText={setName}
                placeholder={getTranslation("payment.placeholderName")}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>{getTranslation("payment.amount")}</Text>
            <TextInput
                style={[
                    styles.input,
                    { borderColor: amount <= 0 ? 'red' : theme.colors.primary }
                ]}
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={(value) => setAmount(parseFloat(value) || 0)}
                placeholder={getTranslation("payment.placeholderAmount")}
            />

            <Text style={[styles.label, { color: theme.colors.text }]}>{getTranslation("payment.startDate")}</Text>
            <TouchableOpacity 
                onPress={() => setShowDatePicker(true)} 
                style={[styles.dateButton, { borderColor: theme.colors.primary }]}
            >
                <Text style={{ color: theme.colors.text }}>📆 {startDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios'); // iOS için modal açık kalmasını engelle
                        if (selectedDate) setStartDate(selectedDate);
                    }}
                />
            )}

            {/* Düzenli Ödeme Seçeneği */}
            <View style={styles.toggleContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>{getTranslation("payment.recurring")}</Text>
                <Switch
                    value={isRecurring}
                    onValueChange={setIsRecurring}
                    trackColor={{ false: theme.colors.card, true: theme.colors.primary }}
                    thumbColor={isRecurring ? theme.colors.primary : theme.colors.text}
                />
            </View>

            {isRecurring && (
                <View>
                    <Text style={[styles.label, { color: theme.colors.text }]}>{getTranslation("payment.installment-count")}</Text>
                    <TextInput
                        style={[
                            styles.input,
                            { borderColor: installments <= 0 ? 'red' : theme.colors.primary }
                        ]}
                        keyboardType="numeric"
                        value={installments.toString()}
                        onChangeText={(value) => {setInstallments(value ?parseInt(value):0) }}
                        placeholder={getTranslation("payment.installment-count")}
                    />
                </View>
            )}

            {/* Kaydet Butonu */}
            <TouchableOpacity onPress={onSave} style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{getTranslation("common.save")}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        margin: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    dateButton: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    toggleButton: {
        padding: 10,
        borderRadius: 5,
    },
    saveButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
});
