import { StyleSheet, Dimensions, View, ActivityIndicator } from "react-native";
import {
  AmountDisplay,
  BaseText,
  BaseView,
  BaseScrollView,
  BaseTouchable,
  BaseFlatList,
  BaseAlert,
} from "@guden-components";
import { BasePage } from "@guden-hooks";
import { Payment, PaymentDetail } from "@guden-models";
import { PaymentService } from "@guden-services";
import { useThemeContext } from "@guden-theme";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import { getDatabase } from "../../services/db";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useLoading } from "../../context/LoadingContext";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ChartDataPoint {
  index: number;
  value: number;
}

interface PaymentDetailPageProps {
  payment: Payment;
}

const PaymentHeader = React.memo(
  ({
    payment,
    paymentDetails,
    totalPaid,
    totalRemaining,
    progress,
    chartData,
    theme,
    getTranslation,
  }: {
    payment: Payment;
    paymentDetails: PaymentDetail[];
    totalPaid: number;
    totalRemaining: number;
    progress: number;
    chartData: any;
    theme: any;
    getTranslation: (key: string) => string;
  }) => {
    const [isChartReady, setIsChartReady] = useState(false);

    useEffect(() => {
      if (paymentDetails.length > 0 && chartData) {
        setIsChartReady(true);
      }
    }, [paymentDetails, chartData]);

    return (
      <>
        {/* Kredi Özeti */}
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

        {/* Grafik */}
        {paymentDetails.length > 0 && (
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
              {getTranslation("payment.payment-chart")}
            </BaseText>
            <BaseScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              style={{ marginVertical: 8 }}
            >
              {!isChartReady ? (
                <View style={{ 
                  width: Dimensions.get("window").width - 60,
                  height: 220,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
              ) : (
                <LineChart
                  data={chartData}
                  width={Math.max(
                    Dimensions.get("window").width - 60,
                    paymentDetails.length * 50
                  )}
                  height={220}
                  chartConfig={{
                    backgroundColor: theme.colors.background,
                    backgroundGradientFrom: theme.colors.background,
                    backgroundGradientTo: theme.colors.background,
                    decimalPlaces: 0,
                    color: (opacity = 1) => theme.colors.primary,
                    labelColor: (opacity = 1) => theme.colors.text,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: theme.colors.primary,
                      color: theme.colors.background,
                    },
                  }}
                  bezier
                  style={{ marginVertical: 8, borderRadius: 16 }}
                  fromZero
                  withDots
                  getDotColor={(dataPoint, index) => {
                    const installment = paymentDetails[index];
                    return installment?.isPaid
                      ? "#4BB543"
                      : `rgba(${theme.colors.primary}, 1)`;
                  }}
                  onDataPointClick={() => {}}
                  renderDotContent={() => null}
                />
              )}
            </BaseScrollView>
          </BaseView>
        )}

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
      </>
    );
  }
);

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
    console.log("detailId", detailId);
    try {
      showLoading();
      const db = await getDatabase();
      if (!db) {
        BaseAlert.error(
          getTranslation("common.error"),
          "Veritabanı bağlantısı kurulamadı. Lütfen uygulamayı yeniden başlatın."
        );
        return;
      }
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
          const db = await getDatabase();
          if (!db) {
            BaseAlert.error(
              getTranslation("common.error"),
              "Veritabanı bağlantısı kurulamadı. Lütfen uygulamayı yeniden başlatın."
            );
            return;
          }

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
  const chartData = React.useMemo(
    () => ({
      labels: paymentDetails.map((_, index) => `${index + 1}`),
      datasets: [
        {
          data: paymentDetails.map((detail) => detail.amount),
          color:
            (opacity = 1) =>
            (detail: ChartDataPoint) => {
              const installment = paymentDetails[detail.index];
              return installment?.isPaid
                ? `rgba(75, 181, 67, ${opacity})` // Yeşil - ödenmiş
                : `rgba(${theme.colors.primary}, ${opacity})`; // Normal renk - ödenmemiş
            },
          strokeWidth: 2,
          withDots: true,
        },
      ],
      legend: ["Taksitler"],
    }),
    [paymentDetails, theme.colors.primary]
  );

  const renderInstallmentItem = React.useCallback(
    ({ item, index }: { item: PaymentDetail; index: number }) => (
      <BaseView
        variant="card"
        backgroundColor={theme.colors.background}
        borderColor={theme.colors.border}
        borderWidth={1}
        borderRadius={10}
        padding="medium"
        style={{ 
          marginBottom: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3
        }}
      >
        {/* Üst Kısım - Taksit No ve Tarih */}
        <BaseView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: `${theme.colors.border}40`
          }}
        >
          <BaseView style={{ flexDirection: "row", alignItems: "center" }}>
            <BaseView
              style={{
                backgroundColor: item.isPaid ? "#4BB54320" : `${theme.colors.primary}20`,
                width: 32,
                height: 32,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10
              }}
            >
              <BaseText
                weight="bold"
                style={{
                  color: item.isPaid ? "#4BB543" : theme.colors.primary,
                  fontSize: 14
                }}
              >
                {index + 1}
              </BaseText>
            </BaseView>
            <BaseText style={{ color: theme.colors.text, fontSize: 16 }}>
              {getTranslation("payment.installment")}
            </BaseText>
          </BaseView>
          <BaseText
            style={{
              color: theme.colors.text,
              fontSize: 14,
              opacity: 0.8
            }}
          >
            {convertDate(item.dueDate)}
          </BaseText>
        </BaseView>

        {/* Alt Kısım - Tutar ve Butonlar */}
        <BaseView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <BaseView>
            <AmountDisplay 
              amount={item.amount} 
              currency="TL"
            />
            {item.isPaid && item.paidDate && (
              <BaseView style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <MaterialCommunityIcons 
                  name="check-circle" 
                  size={16} 
                  color="#4BB543" 
                  style={{ marginRight: 4 }}
                />
                <BaseText
                  style={{ fontSize: 12, color: "#4BB543" }}
                >
                  {`${getTranslation("payment.paid-on")}: ${convertDate(item.paidDate)}`}
                </BaseText>
              </BaseView>
            )}
          </BaseView>

          {item.isPaid ? (
            <BaseTouchable
              variant="default"
              backgroundColor={theme.colors.background}
              size="small"
              style={{ 
                width: 36,
                height: 36,
                borderRadius: 18,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border
              }}
              onPress={() => handleUnmarkAsPaid(item.id!)}
            >
              <MaterialCommunityIcons 
                name="undo-variant" 
                size={20} 
                color={theme.colors.text}
              />
            </BaseTouchable>
          ) : (
            <BaseTouchable
              variant="primary"
              size="small"
              style={{ 
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
              onPress={() => handleMarkAsPaid(item.id!)}
            >
              <MaterialCommunityIcons 
                name="check" 
                size={20} 
                color="white"
                style={{ marginRight: 6 }}
              />
              <BaseText style={{ color: "white", fontWeight: "500" }}>
                {getTranslation("payment.mark-as-paid")}
              </BaseText>
            </BaseTouchable>
          )}
        </BaseView>
      </BaseView>
    ),
    [
      getTranslation,
      convertDate,
      handleMarkAsPaid,
      handleUnmarkAsPaid,
      theme.colors,
    ]
  );

  return (
    <BaseFlatList
      data={paymentDetails}
      renderItem={renderInstallmentItem}
      keyExtractor={(item) => item.id!.toString()}
      ListHeaderComponent={
        <PaymentHeader
          payment={payment}
          paymentDetails={paymentDetails}
          totalPaid={totalPaid}
          totalRemaining={totalRemaining}
          progress={progress}
          chartData={chartData}
          theme={theme}
          getTranslation={getTranslation}
        />
      }
      padding="medium"
    />
  );
};

export default PaymentDetailPage;
