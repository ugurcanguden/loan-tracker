import { BasePage } from '@guden-hooks';
import { Payment } from '@guden-models';
import { PaymentService } from '@guden-services';
import { useThemeContext } from '@guden-theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, ScrollView, StyleProp, StyleSheet, Switch, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { AmountDisplay } from '@guden-components';
import { ValidationErrors, validateAmount, validateInstallments, validatePaymentForm } from '../../utils/validations';
import { createCommonStyles } from '../../components/common/styles';
import { Theme, typography } from '../../../theme/theme';

export interface PaymentFormProps {
    onClosed: () => void;
}
 
const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatAmount = (amount: number): string => {
    return amount.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const getTextInputStyle = (baseStyle: ViewStyle & TextStyle, hasError: boolean, errorStyle: ViewStyle, customStyle?: ViewStyle & TextStyle): TextStyle => {
    return {
        ...baseStyle,
        ...(hasError ? errorStyle : {}),
        ...(customStyle || {})
    } as TextStyle;
};

const getTouchableStyle = (baseStyle: ViewStyle & TextStyle, hasError: boolean, errorStyle: ViewStyle, customStyle?: ViewStyle & TextStyle): ViewStyle => {
    return {
        ...baseStyle,
        ...(hasError ? errorStyle : {}),
        ...(customStyle || {})
    } as ViewStyle;
};

export default function PaymentForm({onClosed}: PaymentFormProps) {
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
    const [showDatePicker, setShowDatePicker] = useState(false);
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

    // Form değişikliklerinde hesaplama yap
    const handleAmountChange = (value: string) => {
        setAmountText(value);
        const newAmount = validateAmount(value);
        setAmount(newAmount);
        if (newAmount > 0 && isRecurring) {
            calculateMonthlyPayment(newAmount, installments);
        }
        if (errors.amount) {
            setErrors((prev: ValidationErrors) => ({ ...prev, amount: undefined }));
        }
    };

    const handleInstallmentsChange = (value: string) => {
        setInstallmentsText(value);
        const newInstallments = validateInstallments(value);
        setInstallments(newInstallments);
        if (amount > 0 && isRecurring) {
            calculateMonthlyPayment(amount, newInstallments);
        }
        if (errors.installments) {
            setErrors((prev: ValidationErrors) => ({ ...prev, installments: undefined }));
        }
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (errors.name) {
            setErrors((prev: ValidationErrors) => ({ ...prev, name: undefined }));
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
            Alert.alert(getTranslation("common.error"), getTranslation("common.saveError"));
        }
    };

    return (
        <ScrollView style={commonStyles.container}>
            <View style={commonStyles.card}>
                {/* Kredi Adı */}
                <Text style={commonStyles.label}>{getTranslation("payment.name")}</Text>
                <TextInput
                    style={getTextInputStyle(commonStyles.input, !!errors.name, commonStyles.inputError)}
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder={getTranslation("payment.placeholderName")}
                    placeholderTextColor={theme.placeholder}
                />
                {errors.name && <Text style={commonStyles.errorText}>{errors.name}</Text>}

                {/* Toplam Tutar */}
                <Text style={commonStyles.label}>{getTranslation("payment.amount")}</Text>
                <TextInput
                    style={getTextInputStyle(commonStyles.input, !!errors.amount, commonStyles.inputError)}
                    keyboardType="numeric"
                    value={amountText}
                    onChangeText={handleAmountChange}
                    placeholder={getTranslation("payment.placeholderAmount")}
                    placeholderTextColor={theme.placeholder}
                />
                {errors.amount && <Text style={commonStyles.errorText}>{errors.amount}</Text>}

                {/* Başlangıç Tarihi */}
                <Text style={commonStyles.label}>{getTranslation("payment.startDate")}</Text>
                <TouchableOpacity 
                    onPress={() => setShowDatePicker(true)} 
                    style={getTouchableStyle(commonStyles.input, false, commonStyles.inputError, { justifyContent: 'center' })}
                >
                    <Text style={commonStyles.text}>📆 {formatDate(startDate)}</Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(Platform.OS === 'ios');
                            if (selectedDate) setStartDate(selectedDate);
                        }}
                    />
                )}

                {/* Taksitli Ödeme Seçeneği */}
                <View style={[commonStyles.row, commonStyles.spaceBetween, commonStyles.marginBottom]}>
                    <Text style={commonStyles.label}>{getTranslation("payment.recurring")}</Text>
                    <Switch
                        value={isRecurring}
                        onValueChange={handleRecurringChange}
                        trackColor={{ false: theme.disabled, true: theme.primary }}
                        thumbColor={isRecurring ? theme.primary : theme.text}
                    />
                </View>

                {isRecurring && (
                    <View>
                        {/* Taksit Sayısı */}
                        <Text style={commonStyles.label}>{getTranslation("payment.installment-count")}</Text>
                        <TextInput
                            style={getTextInputStyle(commonStyles.input, !!errors.installments, commonStyles.inputError)}
                            keyboardType="numeric"
                            value={installmentsText}
                            onChangeText={handleInstallmentsChange}
                            placeholder={getTranslation("payment.placeholderInstallment")}
                            placeholderTextColor={theme.placeholder}
                        />
                        {errors.installments && <Text style={commonStyles.errorText}>{errors.installments}</Text>}

                        {/* Hesaplama Sonuçları */}
                        <View style={[commonStyles.card, { backgroundColor: theme.background }]}>
                            <View style={[commonStyles.row, commonStyles.spaceBetween, commonStyles.marginBottom]}>
                                <Text style={commonStyles.text}>
                                    {getTranslation("payment.monthly-payment")}:
                                </Text>
                                <Text style={[commonStyles.text, { fontWeight: typography.fontWeights.bold, color: theme.primary }]}>
                                    {formatAmount(monthlyPayment)} TL
                                </Text>
                            </View>
                            <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                                <Text style={commonStyles.text}>
                                    {getTranslation("payment.total-payment")}:
                                </Text>
                                <Text style={[commonStyles.text, { fontWeight: typography.fontWeights.bold, color: theme.primary }]}>
                                    {formatAmount(amount)} TL
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Açıklama */}
                <Text style={commonStyles.label}>{getTranslation("payment.description")}</Text>
                <TextInput
                    style={getTextInputStyle(commonStyles.input, false, commonStyles.inputError, { height: 100, textAlignVertical: 'top' })}
                    value={description}
                    onChangeText={setDescription}
                    placeholder={getTranslation("payment.placeholderDescription")}
                    placeholderTextColor={theme.placeholder}
                    multiline
                    numberOfLines={4}
                />

                {/* Kaydet Butonu */}
                <TouchableOpacity 
                    onPress={onSave} 
                    style={commonStyles.button}
                >
                    <Text style={commonStyles.buttonText}>{getTranslation("common.save")}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}


