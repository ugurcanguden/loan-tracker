import React from 'react';
import { BaseView, BaseText, AmountDisplay } from '@guden-components';
import { Payment } from '@guden-models';

interface PaymentSummaryProps {
  payment: Payment;
  totalPaid: number;
  totalRemaining: number;
  progress: number;
  theme: any;
  getTranslation: (key: string) => string;
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  payment,
  totalPaid,
  totalRemaining,
  progress,
  theme,
  getTranslation,
}) => {
  return (
    <BaseView
      variant="card"
      backgroundColor={theme.colors.card}
      padding="medium"
      borderRadius={10}
      style={{ marginBottom: 15 }}
    >
      <BaseText
        variant="subtitle"
        weight="bold"
        style={{ marginBottom: 10, color: theme.colors.text }}
      >
        {getTranslation("payment.summary")}
      </BaseText>

      <BaseView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <BaseText style={{ color: theme.colors.text }}>
          {getTranslation("payment.total-amount")}
        </BaseText>
        <AmountDisplay amount={payment.amount} currency="TL" />
      </BaseView>

      <BaseView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <BaseText style={{ color: theme.colors.text }}>
          {getTranslation("payment.total-paid")}
        </BaseText>
        <AmountDisplay amount={totalPaid} currency="TL" />
      </BaseView>

      <BaseView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <BaseText style={{ color: theme.colors.text }}>
          {getTranslation("payment.total-remaining")}
        </BaseText>
        <AmountDisplay amount={totalRemaining} currency="TL" />
      </BaseView>

      {/* İlerleme Çubuğu */}
      <BaseView style={{ marginTop: 10 }}>
        <BaseView
          style={{
            height: 10,
            borderRadius: 5,
            overflow: "hidden",
            backgroundColor: theme.colors.background,
          }}
        >
          <BaseView
            style={{
              height: "100%",
              borderRadius: 5,
              backgroundColor: theme.colors.primary,
              width: `${progress}%`,
            }}
          />
        </BaseView>
        <BaseText
          style={{
            textAlign: "center",
            marginTop: 5,
            color: theme.colors.text,
          }}
        >
          {`${progress.toFixed(1)}%`}
        </BaseText>
      </BaseView>
    </BaseView>
  );
}; 