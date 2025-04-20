import React, { useEffect, useState } from 'react';
import { BaseView, BaseText, BaseDescription, DescriptionItemProps, CoreCard } from '@guden-components';
import { useThemeContext } from '@guden-theme';
import { PaymentSummary } from '@guden-models';
import { BasePage } from '@guden-hooks';
import { PaymentService } from '@guden-services';
import { use } from 'i18next';
import { setDate } from 'date-fns';

interface SummarySectionProps {
    apiCallCount: number;
    startDate: string | null;
    endDate: string | null;
}

const SummarySection: React.FC<SummarySectionProps> = (props: SummarySectionProps) => {
    const { apiCallCount, startDate, endDate } = props;
    const { theme } = useThemeContext();
    const { getTranslation } = BasePage();
    const { getPaymentSummary } = PaymentService();
    const [summary, setSummary] = useState<PaymentSummary | null>(null);


    useEffect(() => {
        getPaymentSummary(startDate || undefined, endDate || undefined).then((data) => {
            setSummary(data);
        });
    }
        , [apiCallCount, startDate, endDate]);

    const summaryItems = [
        {
            label: getTranslation("payment.total-amount"),
            value: summary?.totalAmount || 0,
            isCurrency: true,
        },
        {
            label: getTranslation("payment.total-paid"),
            value: summary?.totalPaid || 0,
            isCurrency: true,
        },
        {
            label: getTranslation("payment.total-remaining"),
            value: summary?.totalRemaining || 0,
            isCurrency: true,
        },
        {
            label: getTranslation("payment.monthly-payment"),
            value: summary?.monthlyPayment || 0,
            isCurrency: true,
        },
        {
            label: getTranslation("payment.total-payments"),
            value: summary?.totalPayments || 0,
        },
        {
            label: getTranslation("payment.overdue-payments"),
            value: summary?.overdueCount || 0,
            textStyle: { color: theme.colors.error },
        },
    ];

    return (
        <CoreCard padding="medium" variant="default">
            <BaseText variant="title" weight="bold">
                {getTranslation("payment.summary")}
            </BaseText>
            <BaseDescription
                items={summaryItems as DescriptionItemProps[]}
                column={2}
            />
        </CoreCard>
    );
};

export default SummarySection;