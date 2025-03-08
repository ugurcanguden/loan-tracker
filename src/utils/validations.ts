import i18next from 'i18next';

export const validateAmount = (value: string): number => {
    // Virgüllü sayıyı doğru şekilde parse et
    const cleanValue = value.replace(/[^0-9,]/g, '').replace(',', '.');
    const amount = parseFloat(cleanValue);
    return isNaN(amount) ? 0 : amount;
};

export const validateInstallments = (value: string): number => {
    if (!value || value === '') return 0;
    const parsedValue = parseInt(value.replace(/[^0-9]/g, ''));
    return isNaN(parsedValue) ? 0 : parsedValue;
};

export interface ValidationErrors {
    name?: string;
    amount?: string;
    installments?: string;
}

export const validatePaymentForm = (
    name: string,
    amount: number,
    isRecurring: boolean,
    installments: number
): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!name.trim()) {
        errors.name = i18next.t('validation.nameRequired');
    }

    if (amount <= 0) {
        errors.amount = i18next.t('validation.amountRequired');
    }

    if (isRecurring && (installments < 1 || installments > 120)) {
        errors.installments = i18next.t('validation.installmentsRequired');
    }

    return errors;
}; 