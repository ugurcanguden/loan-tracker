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
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";

export interface MonthlyOverviewRef {
  fetchSummaryData: () => Promise<void>;
}

export const MonthlyOverview = forwardRef<MonthlyOverviewRef>((_, ref) => {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();
  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getIncomeSummary } = IncomeService();
  const { getPaymentSummary } = PaymentService();

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
      console.error("Aylık özet veriler getirilirken hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchSummaryData
  }));

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const monthlyItems = [
    {
      label: getTranslation("home.monthly-income"),
      value: incomeSummary?.monthlyTotal || 0,
      isCurrency: true,
      textStyle: { color: theme.colors.success },
    },
    {
      label: getTranslation("home.monthly-payment"),
      value: paymentSummary?.monthlyPayment || 0,
      isCurrency: true,
      textStyle: { color: theme.colors.error },
    },
    {
      label: getTranslation("home.monthly-balance"),
      value:
        (incomeSummary?.monthlyTotal || 0) -
        (paymentSummary?.monthlyPayment || 0),
      isCurrency: true,
      textStyle: {
        color:
          (incomeSummary?.monthlyTotal || 0) -
            (paymentSummary?.monthlyPayment || 0) >=
          0
            ? theme.colors.success
            : theme.colors.error,
      },
    },
    {
      label: getTranslation("home.upcoming-payments"),
      value: paymentSummary?.overdueCount || 0,
      textStyle: { color: theme.colors.warning },
    },
  ];

  return (
    <BaseView variant="card" padding="medium" style={styles.container}>
      <BaseView style={styles.header}>
        <BaseText variant="title" weight="bold" style={styles.title}>
          {getTranslation("home.monthly-overview")}
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
      <BaseDescription items={monthlyItems as DescriptionItemProps[]} column={2} />
    </BaseView>
  );
});

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