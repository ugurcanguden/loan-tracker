import React, { useEffect, useState, useMemo } from "react";
import { BaseFlatList } from "@guden-components";
import { useLoading } from "../../../contexts";
import { BasePage } from "@guden-hooks";
import { Payment, PaymentDetail } from "@guden-models";
import { PaymentService } from "@guden-services";
import { useThemeContext } from "@guden-theme";
import { BaseAlert } from "@guden-components";
import { PaymentSummary } from "./components/PaymentSummary";
import { PaymentChart } from "./components/PaymentChart";
import { PaymentInstallmentList } from "./components/PaymentInstallmentList";

interface PaymentDetailPageProps {
  payment: Payment;
}

export const PaymentDetailPage = ({ payment }: PaymentDetailPageProps) => {
  const { getTranslation, convertDate } = BasePage();
  const { getPaymentDetails, markInstallmentAsPaid, unmarkInstallmentAsPaid } =
    PaymentService();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const { theme } = useThemeContext();

  useEffect(() => {
    fetchPaymentDetails();
  }, [payment]); 
  const fetchPaymentDetails = async () => {
    try {
      showLoading();
      if (!payment?.id) {
        console.warn("Geçerli ödeme ID'si bulunamadı");
        return;
      }
      const data = await getPaymentDetails(payment.id);
      if (!data) {
        console.warn("Ödeme detayları bulunamadı");
        return;
      }
      setPaymentDetails(data);
    } catch (error) {
      console.error("Ödeme detayları getirilirken hata:", error);
      BaseAlert.error(
        getTranslation("common.error"),
        "Ödeme detayları alınırken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      hideLoading();
    }
  }; 
  const handleMarkAsPaid = async (detailId: number) => {
    try {
      showLoading();
      await markInstallmentAsPaid(detailId);
      await fetchPaymentDetails();
      BaseAlert.success(
        getTranslation("common.success"),
        getTranslation("payment.marked-as-paid")
      );
    } catch (error) {
      console.error("Taksit ödenmiş olarak işaretlenirken hata:", error);
      BaseAlert.error(
        getTranslation("common.error"),
        "İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      hideLoading();
    }
  }; 
  const handleUnmarkAsPaid = async (detailId: number) => {
    BaseAlert.confirm(
      getTranslation("payment.unmark-title"),
      getTranslation("payment.unmark-message"),
      async () => {
        try {
          showLoading();
          await unmarkInstallmentAsPaid(detailId);
          await fetchPaymentDetails();
          BaseAlert.success(
            getTranslation("common.success"),
            getTranslation("payment.unmarked-as-paid")
          );
        } catch (error) {
          console.error("Taksit ödenmemiş olarak işaretlenirken hata:", error);
          BaseAlert.error(
            getTranslation("common.error"),
            "İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin."
          );
        } finally {
          hideLoading();
        }
      }
    );
  };  
  // İstatistik hesaplamaları
  const totalPaid = paymentDetails.reduce(
    (sum, detail) => sum + (detail.isPaid ? detail.amount : 0),
    0
  );
  const totalRemaining = paymentDetails.reduce(
    (sum, detail) => sum + (!detail.isPaid ? detail.amount : 0),
    0
  );
  const progress = (totalPaid / payment.amount) * 100; 
  // Grafik verilerini hazırla
  const chartData = useMemo(
    () => ({
      labels: paymentDetails.map((_, index) => `${index + 1}`),
      datasets: [
        {
          data: paymentDetails.map((detail) => detail.amount),
          color: (opacity = 1) => theme.colors.primary,
          strokeWidth: 2,
          withDots: true,
        },
      ],
      legend: ["Taksitler"],
    }),
    [paymentDetails, theme.colors.primary]
  ); 
  const renderHeader = () => (
    <>
      <PaymentSummary
        payment={payment}
        totalPaid={totalPaid}
        totalRemaining={totalRemaining}
        progress={progress}
        theme={theme}
        getTranslation={getTranslation}
      />
      <PaymentChart
        paymentDetails={paymentDetails}
        chartData={chartData}
        theme={theme}
        getTranslation={getTranslation}
      />
      <PaymentInstallmentList
        paymentDetails={paymentDetails}
        theme={theme}
        getTranslation={getTranslation}
        convertDate={convertDate}
        onMarkAsPaid={handleMarkAsPaid}
        onUnmarkAsPaid={handleUnmarkAsPaid}
      />
    </>
  );

  return (
    <BaseFlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={renderHeader}
      padding="medium"
    />
  );
};

export default PaymentDetailPage;
