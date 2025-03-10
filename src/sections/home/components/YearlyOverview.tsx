import { StyleSheet } from "react-native";
import { 
  BaseText, 
  BaseView, 
  BaseDescription, 
  DescriptionItemProps,
  BaseButton,
  BaseIcon 
} from "@guden-components";
import { BasePage } from "@guden-hooks";
import { useThemeContext } from "@guden-theme";
import { IncomeSummary, PaymentSummary } from "@guden-models";
import { IncomeService, PaymentService } from "@guden-services";
import { useEffect, useState, useImperativeHandle } from "react";
import { useGlobalState } from "@guden-context";
 
export const YearlyOverview = () => {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();
  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getIncomeSummary } = IncomeService();
  const { getPaymentSummary } = PaymentService();
  const { refreshCount} = useGlobalState();

  const fetchSummaryData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const [incomeData, paymentData] = await Promise.all([
        getIncomeSummary(),
        getPaymentSummary(),
      ]);
      setIncomeSummary(incomeData);
      setPaymentSummary(paymentData);
    } catch (error) {
      console.error("Yıllık özet veriler getirilirken hata:", error);
    } finally {
      setIsLoading(false);
    }
  }; 
  useEffect(() => {
    fetchSummaryData();
  }, []);
  useEffect(() => {
    if (refreshCount > 0) {
      fetchSummaryData();
    }
  }, [refreshCount]);

  const yearlyItems = [
    {
      label: getTranslation("home.yearly-income"),
      value: incomeSummary?.yearlyTotal || 0,
      isCurrency: true,
      textStyle: { color: theme.colors.success },
    },
    {
      label: getTranslation("home.yearly-payment"),
      value: paymentSummary?.totalAmount || 0,
      isCurrency: true,
      textStyle: { color: theme.colors.error },
    },
    {
      label: getTranslation("home.yearly-balance"),
      value:
        (incomeSummary?.yearlyTotal || 0) -
        (paymentSummary?.totalAmount || 0),
      isCurrency: true,
      textStyle: {
        color:
          (incomeSummary?.yearlyTotal || 0) -
            (paymentSummary?.totalAmount || 0) >=
          0
            ? theme.colors.success
            : theme.colors.error,
      },
    },
    {
      label: getTranslation("home.total-transactions"),
      value:
        (incomeSummary?.totalIncomes || 0) +
        (paymentSummary?.totalPayments || 0),
    },
  ];

  return (
    <BaseView variant="card" padding="medium" style={styles.container}>
      <BaseView style={styles.header}>
        <BaseText variant="title" weight="bold" style={styles.title}>
          {getTranslation("home.yearly-overview")}
        </BaseText>
        <BaseButton
          variant="icon"
          onPress={fetchSummaryData}
          loading={isLoading}
          style={styles.refreshButton}
        >
          <BaseIcon name="refresh" size={20} color={theme.colors.text} />
        </BaseButton>
      </BaseView>
      <BaseDescription items={yearlyItems as DescriptionItemProps[]} column={2} />
    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  refreshButton: {
    marginLeft: 8,
  },
}); 