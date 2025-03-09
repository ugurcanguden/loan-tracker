import React from 'react';
import { BaseView, BaseText } from '@guden-components';
import { PaymentDetail } from '@guden-models';
import { InstallmentItem } from './InstallmentItem';

interface PaymentInstallmentListProps {
  paymentDetails: PaymentDetail[];
  theme: any;
  getTranslation: (key: string) => string;
  convertDate: (date: string) => string;
  onMarkAsPaid: (id: number) => void;
  onUnmarkAsPaid: (id: number) => void;
}

export const PaymentInstallmentList: React.FC<PaymentInstallmentListProps> = ({
  paymentDetails,
  theme,
  getTranslation,
  convertDate,
  onMarkAsPaid,
  onUnmarkAsPaid,
}) => {
  return (
    <>
      {/* Taksit Listesi Başlığı */}
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
          {getTranslation("payment.installments")}
        </BaseText>
      </BaseView>

      {/* Taksit Listesi */}
      {paymentDetails.map((item, index) => (
        <InstallmentItem
          key={item.id?.toString()}
          item={item}
          index={index}
          theme={theme}
          getTranslation={getTranslation}
          convertDate={convertDate}
          onMarkAsPaid={onMarkAsPaid}
          onUnmarkAsPaid={onUnmarkAsPaid}
        />
      ))}
    </>
  );
}; 