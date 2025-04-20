import React, { useEffect, useState } from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import {
  CoreButton,
  CoreDateInput,
  CoreInput,
  CoreMoneyInput,
  CoreSelect,
  CoreText,
  CoreView,
} from '@guden-components';

import { useThemeContext } from '@guden-theme';
import { PaymentCategoryService, PaymentService } from '@guden-services';
import { Payment, PaymentCategory } from '@guden-models';
import { useNotification } from '@guden-hooks';
import { validatePaymentForm } from '../../utils/validations';

export interface PaymentFormProps {
  onClosed: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ onClosed }) => {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const { notify } = useNotification();
  const { addPayment } = PaymentService();

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [isRecurring, setIsRecurring] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      name: '',
      amount: '',
      installments: '1',
      startDate: new Date().toISOString(),
      description: '',
    },
  });

  const amountStr = watch('amount') || '0';
  const installmentsStr = watch('installments') || '1';
  const amount = parseFloat(amountStr.replace(',', '.')) || 0;
  const installments = parseInt(installmentsStr) || 1;

  useEffect(() => {
    if (isRecurring && amount > 0 && installments > 0) {
      const monthly = amount / installments;
      setMonthlyPayment(parseFloat(monthly.toFixed(2)));
    } else {
      setMonthlyPayment(0);
    }
  }, [amount, installments, isRecurring]);

  const formatAmount = (val: number): string =>
    val.toLocaleString(t('locale'), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleInstallmentChange = (inc: boolean) => {
    let newValue = inc ? installments + 1 : installments - 1;
    newValue = Math.min(Math.max(newValue, 1), 120);
    setValue('installments', newValue.toString());
  };

  const onSave = async (form: any) => {
    const parsedAmount = parseFloat(form.amount.replace(',', '.')) || 0;
    const parsedInstallments = parseInt(form.installments) || 1;

    const validation = validatePaymentForm(
      form.name,
      parsedAmount,
      isRecurring,
      parsedInstallments
    );

    if (Object.keys(validation).length > 0) {
      notify({ message: t('common.mandatoryFields'), type: 'warning' });
      return;
    }

    const payment: Payment = {
      name: form.name,
      amount: parsedAmount,
      startDate: form.startDate,
      isRecurring: isRecurring ? 1 : 0,
      installments: isRecurring ? parsedInstallments : 1,
      description: form.description,
    };

    try {
      await addPayment(payment);
      notify({ message: t('common.success'), type: 'success' });
      onClosed();
    } catch (error) {
      console.error(error);
      notify({ message: t('common.saveError'), type: 'error' });
    }
  };
  const [categories, setCategories] = useState<PaymentCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryService = PaymentCategoryService();
      const fetchedCategories = await categoryService.getCategories();
      setCategories(fetchedCategories);
      console.log(fetchedCategories);
    }; 
    fetchCategories();
  }, []);
  return (
    <CoreView variant="card" padding="md">
      <CoreSelect
        label="Kategori Seçin"
        options={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}  
        control={control}
        name="categoryId"
        required
        message="Kategori seçiniz"
      />
      <CoreInput
        name="name"
        control={control}
        label={t('payment.name')}
        placeholder={t('payment.placeholderName')}
        required
        minLength={2}
        message={t('payment.nameError')}
      />

      <CoreMoneyInput
        name="amount"
        control={control}
        label={t('payment.amount')}
        placeholder={t('payment.placeholderAmount')}
        required
        min={1}
        message={t('payment.amountError')}
      />

      <CoreDateInput
        name="startDate"
        control={control}
        label={t('payment.startDate')}
        required
        message={t('payment.startDateError')}
      />

      <View style={styles.switchContainer}>
        <CoreText variant="label">{t('payment.recurring')}</CoreText>
        <Switch
          value={isRecurring}
          onValueChange={(val) => setIsRecurring(val)}
          trackColor={{ false: theme.disabled, true: theme.primary }}
          thumbColor={isRecurring ? theme.primary : theme.text}
        />
      </View>

      {isRecurring && (
        <CoreView gap="sm">
          <CoreText variant="label">{t('payment.installments')}</CoreText>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CoreButton
              label=""
              variant="ghost"
              iconLeft={<MaterialCommunityIcons name="minus" />}
              onPress={() => handleInstallmentChange(false)}
              disabled={installments <= 1}
              style={{ width: "30%" }}
            />

            <CoreInput
              name="installments"
              control={control}
              placeholder="1"
              keyboardType="numeric"
              required
              message={t('payment.installmentsError')}
              style={{ width: "40%" }}
            />

            <CoreButton
              label=""
              variant="ghost"
              iconLeft={<MaterialCommunityIcons name="plus" />}
              onPress={() => handleInstallmentChange(true)}
              disabled={installments >= 120}
              style={{ width: "30%" }}
            />
          </View>
          <CoreView gap="xs">
            <CoreText>
              {t('payment.monthly-payment')}:{' '}
              <CoreText weight="bold" style={{ color: theme.primary }}>
                {formatAmount(monthlyPayment)} TL
              </CoreText>
            </CoreText>
            <CoreText>
              {t('payment.total-payment')}:{' '}
              <CoreText weight="bold" style={{ color: theme.primary }}>
                {formatAmount(amount)} TL
              </CoreText>
            </CoreText>
          </CoreView>
        </CoreView>
      )}

      <CoreInput
        name="description"
        control={control}
        label={t('payment.description')}
        placeholder={t('payment.placeholderDescription')}
        multiline
        numberOfLines={4}
      />

      <CoreButton
        label={t('common.save')}
        onPress={handleSubmit(onSave)}
        variant="primary"
        style={styles.saveButton}
      />
    </CoreView>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    alignItems: 'center',
  },
  installmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  installmentInput: {
    width: 60,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 20,
  },
});
