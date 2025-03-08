import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { AmountDisplay, BaseText } from "@guden-components";
import { BasePage } from "@guden-hooks";
import { Payment, PaymentDetail } from "@guden-models";
import { PaymentService } from "@guden-services";
import { useThemeContext } from "@guden-theme";
import { DateFormat } from "guden-core";
import { LineChart } from "react-native-chart-kit";
import { getDatabase } from "../../services/db";

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
  }) => (
    <>
      {/* Kredi Özeti */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <BaseText
          text={getTranslation("payment.summary")}
          style={[styles.sectionTitle, { color: theme.colors.text }]}
        />

        <View style={styles.summaryRow}>
          <BaseText
            text={getTranslation("payment.total-amount")}
            style={{ color: theme.colors.text }}
          />
          <AmountDisplay amount={payment.amount} currency="TL" />
        </View>

        <View style={styles.summaryRow}>
          <BaseText
            text={getTranslation("payment.total-paid")}
            style={{ color: theme.colors.text }}
          />
          <AmountDisplay amount={totalPaid} currency="TL" />
        </View>

        <View style={styles.summaryRow}>
          <BaseText
            text={getTranslation("payment.total-remaining")}
            style={{ color: theme.colors.text }}
          />
          <AmountDisplay amount={totalRemaining} currency="TL" />
        </View>

        {/* İlerleme Çubuğu */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary,
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
          <BaseText
            text={`${progress.toFixed(1)}%`}
            style={[styles.progressText, { color: theme.colors.text }]}
          />
        </View>
      </View>

      {/* Grafik */}
      {paymentDetails.length > 0 && (
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <BaseText
            text={getTranslation("payment.payment-chart")}
            style={[styles.sectionTitle, { color: theme.colors.text }]}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={styles.chartContainer}
          >
            <LineChart
              data={chartData}
              width={Math.max(
                Dimensions.get("window").width - 60,
                paymentDetails.length * 50
              )}
              height={220}
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) =>
                  `rgba(${theme.colors.primary}, ${opacity})`,
                labelColor: (opacity = 1) => theme.colors.text,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: theme.colors.primary,
                  color: theme.colors.primary,
                },
              }}
              bezier
              style={styles.chart}
              fromZero
              withDots
              getDotColor={(dataPoint, index) => {
                const installment = paymentDetails[index];
                return installment?.isPaid
                  ? "#4BB543" // Yeşil - ödenmiş
                  : `rgba(${theme.colors.primary}, 1)`; // Normal renk - ödenmemiş
              }}
            />
          </ScrollView>
        </View>
      )}

      {/* Taksit Listesi Başlığı */}
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <BaseText
          text={getTranslation("payment.installments")}
          style={[styles.sectionTitle, { color: theme.colors.text }]}
        />
      </View>
    </>
  )
);

export const PaymentDetailPage = ({ payment }: PaymentDetailPageProps) => {
  const { getTranslation, convertDate } = BasePage();
  const { getPaymentDetails, markInstallmentAsPaid, unmarkInstallmentAsPaid } =
    PaymentService();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useThemeContext();

  useEffect(() => {
    fetchPaymentDetails();
  }, [payment]);

  const fetchPaymentDetails = async () => {
    try {
      setIsLoading(true);
      if (!payment?.id) {
        console.warn("Geçerli ödeme ID'si bulunamadı");
        return;
      }

      const db = await getDatabase();
      if (!db) {
        console.error("Veritabanı bağlantısı kurulamadı");
        Alert.alert(
          getTranslation("common.error"),
          "Veritabanı bağlantısı kurulamadı. Lütfen uygulamayı yeniden başlatın."
        );
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
      Alert.alert(
        getTranslation("common.error"),
        "Ödeme detayları alınırken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (detailId: number) => {
    try {
      const db = await getDatabase();
      if (!db) {
        Alert.alert(
          getTranslation("common.error"),
          "Veritabanı bağlantısı kurulamadı. Lütfen uygulamayı yeniden başlatın."
        );
        return;
      }
      console.log("detailId", detailId);
      await markInstallmentAsPaid(detailId);
      await fetchPaymentDetails();
      Alert.alert(
        getTranslation("common.success"),
        getTranslation("payment.marked-as-paid")
      );
    } catch (error) {
      console.error("Taksit ödenmiş olarak işaretlenirken hata:", error);
      Alert.alert(
        getTranslation("common.error"),
        "İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleUnmarkAsPaid = async (detailId: number) => {
    Alert.alert(
      getTranslation("payment.unmark-title"),
      getTranslation("payment.unmark-message"),
      [
        { text: getTranslation("common.cancel"), style: "cancel" },
        {
          text: getTranslation("common.confirm"),
          style: "destructive",
          onPress: async () => {
            try {
              const db = await getDatabase();
              if (!db) {
                Alert.alert(
                  getTranslation("common.error"),
                  "Veritabanı bağlantısı kurulamadı. Lütfen uygulamayı yeniden başlatın."
                );
                return;
              }

              await unmarkInstallmentAsPaid(detailId);
              await fetchPaymentDetails();
              Alert.alert(
                getTranslation("common.success"),
                getTranslation("payment.unmarked-as-paid")
              );
            } catch (error) {
              console.error(
                "Taksit ödenmemiş olarak işaretlenirken hata:",
                error
              );
              Alert.alert(
                getTranslation("common.error"),
                "İşlem sırasında bir hata oluştu. Lütfen tekrar deneyin."
              );
            }
          },
        },
      ]
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
      <View
        style={[
          styles.installmentRow,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.installmentInfo}>
          <BaseText
            text={`${index + 1}. ${getTranslation("payment.installment")}`}
            style={[styles.installmentTitle, { color: theme.colors.text }]}
          />
          <BaseText
            text={convertDate(item.dueDate)}
            style={[styles.installmentDate, { color: theme.colors.text }]}
          />
          <AmountDisplay amount={item.amount} />
          {item.isPaid && item.paidDate && (
            <BaseText
              text={`✓ ${getTranslation("payment.paid-on")}: ${convertDate(
                item.paidDate
              )}`}
              style={[styles.paidDate, { color: "#4BB543" }]}
            />
          )}
        </View>

        {item.isPaid ? (
          <TouchableOpacity
            onPress={() => handleUnmarkAsPaid(item.id!)}
            style={[
              styles.payButton,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <BaseText
              text={getTranslation("payment.unmark-as-paid")}
              style={styles.payButtonText}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleMarkAsPaid(item.id!)}
            style={[
              styles.payButton,
              { backgroundColor: theme.colors.primary },
            ]}
          >
            <BaseText
              text={getTranslation("payment.mark-as-paid")}
              style={styles.payButtonText}
            />
          </TouchableOpacity>
        )}
      </View>
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
    <FlatList
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
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  section: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressText: {
    textAlign: "center",
    marginTop: 5,
  },
  chartContainer: {
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  installmentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  installmentInfo: {
    flex: 1,
  },
  installmentTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  installmentDate: {
    marginBottom: 5,
  },
  payButton: {
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  payButtonText: {
    color: "white",
  },
  paidDate: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default PaymentDetailPage;
