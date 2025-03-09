import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
    BaseAmountInput,
    BaseDateInput,
    BaseDatePicker,
    BaseText,
    BaseTextArea,
    BaseTextInput,
    BaseTouchable,
    BaseView,
    createCommonStyles
} from '@guden-components';
import { BasePage } from '@guden-hooks';
import { Payment } from '@guden-models';
import { PaymentService } from '@guden-services';
import { useThemeContext } from '@guden-theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { ValidationErrors, validatePaymentForm } from '../../utils/validations';

export interface PaymentFormProps {
    onClosed: () => void;
} 
const formatAmount = (amount: number): string => {
    return amount.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export default function PaymentForm({ onClosed }: PaymentFormProps) {
    const { theme } = useThemeContext();
    const { addPayment } = PaymentService();
    const { t } = useTranslation();
    const { getTranslation } = BasePage();
    const commonStyles = createCommonStyles(theme);

    // Form state
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<number>(0);
    const [amountText, setAmountText] = useState('0');
    const [startDate, setStartDate] = useState(new Date());
    const [isRecurring, setIsRecurring] = useState(false);
    const [installments, setInstallments] = useState<number>(1);
    const [installmentsText, setInstallmentsText] = useState('1');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Hesaplama state'leri
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

    // Taksit tutarını hesapla
    const calculateMonthlyPayment = (totalAmount: number, months: number) => {
        if (totalAmount > 0 && months > 0) {
            const monthly = totalAmount / months;
            setMonthlyPayment(parseFloat(monthly.toFixed(2)));
        } 
    };

    const handleAmountChange = (rawValue: string, formattedValue: string) => {
        setAmountText(rawValue);
        // Virgüllü sayıyı doğru şekilde parse et
        const cleanValue = rawValue.replace(/[^0-9,]/g, '').replace(',', '.'); 
        const newAmount = parseFloat(cleanValue)/100 || 0;
        setAmount(newAmount);
        
        if (newAmount > 0 && isRecurring) {
            calculateMonthlyPayment(newAmount, installments);
        }
        if (newAmount == 0 && isRecurring) {
            setMonthlyPayment(0);
        }
        if (errors.amount) {
            setErrors(prev => ({ ...prev, amount: undefined }));
        }
    };

    const handleInstallmentChange = (increment: boolean) => {
        const newInstallments = increment ? 
            Math.min(installments + 1, 120) : 
            Math.max(installments - 1, 1);
        
        setInstallments(newInstallments);
        setInstallmentsText(newInstallments.toString());

        if (amount > 0 && isRecurring) {
            calculateMonthlyPayment(amount, newInstallments);
        }
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (errors.name) {
            setErrors(prev => ({ ...prev, name: undefined }));
        }
    };

    const handleRecurringChange = (value: boolean) => {
        setIsRecurring(value);
        if (!value) {
            setInstallments(1);
            setInstallmentsText('1');
        }
        if (value && amount > 0) {
            calculateMonthlyPayment(amount, installments);
        }
    };

    const validateForm = (): boolean => {
        const validationErrors = validatePaymentForm(name, amount, isRecurring, installments);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const onSave = async () => {
        if (!validateForm()) {
            Alert.alert(getTranslation("common.error"), getTranslation("common.mandatoryFields"));
            return;
        }

        const payment: Payment = {
            name,
            amount,
            startDate: startDate.toISOString(),
            isRecurring: isRecurring ? 1 : 0,
            installments: isRecurring ? installments : 1,
            description
        };

        try {
            await addPayment(payment);
            Alert.alert(getTranslation("common.success"));
            onClosed();
        } catch (error) {
            console.log(error);
            Alert.alert(getTranslation("common.error"), getTranslation("common.saveError"));
        }
    };
 
    return (
        
            <BaseView variant="card" padding="medium" style={styles.formContainer}>
                {/* Kredi Adı */}
                <BaseText variant="label">{getTranslation("payment.name")}</BaseText>
                <BaseTextInput
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder={getTranslation("payment.placeholderName")}
                    error={!!errors.name}
                />
                {errors.name && (
                    <BaseText variant="error">{errors.name}</BaseText>
                )}

                {/* Toplam Tutar */}
                <BaseText variant="label">{getTranslation("payment.amount")}</BaseText>
                <BaseAmountInput
                    value={amountText}
                    onChangeText={handleAmountChange}
                    placeholder={getTranslation("payment.placeholderAmount")}
                    error={!!errors.amount}
                />
                {errors.amount && (
                    <BaseText variant="error">{errors.amount}</BaseText>
                )}

                {/* Başlangıç Tarihi */}
                <BaseText variant="label">{getTranslation("payment.startDate")}</BaseText>
                <BaseDatePicker onChange={(data)=>setStartDate(new Date(data!))} value={startDate.toISOString()}></BaseDatePicker>
                

                {/* Taksitli Ödeme Seçeneği */}
                <View style={styles.switchContainer}>
                    <BaseText variant="label">{getTranslation("payment.recurring")}</BaseText>
                    <Switch
                        value={isRecurring}
                        onValueChange={handleRecurringChange}
                        trackColor={{ false: theme.disabled, true: theme.primary }}
                        thumbColor={isRecurring ? theme.primary : theme.text}
                    />
                </View>

                {isRecurring && (
                    <BaseView variant="card">
                        {/* Taksit Sayısı */}
                        <BaseText variant="label">{getTranslation("payment.installment-count")}</BaseText>
                        <BaseView style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 10,
                            backgroundColor: theme.colors.background,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: errors.installments ? theme.colors.error : theme.colors.border,
                            padding: 8
                        }}>
                            <BaseTouchable
                                variant="default"
                                size="small"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: installments <= 1 ? theme.colors.disabled : theme.colors.secondary,
                                    opacity: installments <= 1 ? 0.5 : 1
                                }}
                                onPress={() => handleInstallmentChange(false)}
                                disabled={installments <= 1}
                            >
                                <MaterialCommunityIcons 
                                    name="minus" 
                                    size={20} 
                                    color="#FFFFFF"
                                />
                            </BaseTouchable>

                            <BaseText 
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: theme.colors.text
                                }}
                            >
                                {installments}
                            </BaseText>

                            <BaseTouchable
                                variant="default"
                                size="small"
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: installments >= 120 ? theme.colors.disabled : theme.colors.secondary,
                                    opacity: installments >= 120 ? 0.5 : 1
                                }}
                                onPress={() => handleInstallmentChange(true)}
                                disabled={installments >= 120}
                            >
                                <MaterialCommunityIcons 
                                    name="plus" 
                                    size={20} 
                                    color="#FFFFFF"
                                />
                            </BaseTouchable>
                        </BaseView>
                        {errors.installments && (
                            <BaseText variant="error">{errors.installments}</BaseText>
                        )}

                        {/* Hesaplama Sonuçları */}
                        <BaseView style={styles.calculationContainer}  >
                            <View style={styles.calculationRow}>
                                <BaseText>
                                    {getTranslation("payment.monthly-payment")}:
                                </BaseText>
                                <BaseText weight="bold" style={{ color: theme.colors.primary }}>
                                    {formatAmount(monthlyPayment)} TL
                                </BaseText>
                            </View>
                            <View style={styles.calculationRow}>
                                <BaseText>
                                    {getTranslation("payment.total-payment")}:
                                </BaseText>
                                <BaseText weight="bold" style={{ color: theme.colors.primary }}>
                                    {formatAmount(amount)} TL
                                </BaseText>
                            </View>
                        </BaseView>
                    </BaseView>
                )}

                {/* Açıklama */}
                <BaseText variant="label">{getTranslation("payment.description")}</BaseText>
                <BaseTextArea
                    value={description}
                    onChangeText={setDescription}
                    placeholder={getTranslation("payment.placeholderDescription")}
                    minHeight={100}
                />

                {/* Kaydet Butonu */}
                <BaseTouchable
                    onPress={onSave}
                    variant="primary"
                    size="large"
                    style={styles.saveButton}
                >
                    <BaseText style={{ color: '#FFFFFF' }}>
                        {getTranslation("common.save")}
                    </BaseText>
                </BaseTouchable>
            </BaseView> 
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        flex: 1,
    },
    closeButton: {
        padding: 5,
    },
    formContainer: {
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    calculationContainer: {
        marginTop: 15,
        padding: 10, 
        borderRadius: 8,
    },
    calculationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    saveButton: {
        marginTop: 20,
    }
});


