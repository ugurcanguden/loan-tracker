import { StyleSheet, Platform } from "react-native";
import { 
  BaseText, 
  BaseView, 
  BaseButton,
  BaseIcon,
  BaseTabs,
  BaseTabItem,
} from "@guden-components";
import { BasePage } from "@guden-hooks";
import { useThemeContext } from "@guden-theme";
import { IncomeSummary, PaymentSummary } from "@guden-models";
import { IncomeService, PaymentService } from "@guden-services";
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export interface ChartOverviewRef {
  fetchChartData: () => Promise<void>;
}

export const ChartOverview = forwardRef<ChartOverviewRef>((_, ref) => {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();
  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { getIncomeSummary } = IncomeService();
  const { getPaymentSummary } = PaymentService();

  const fetchChartData = async () => {
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
      console.error("Grafik verileri getirilirken hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchChartData
  }));

  useEffect(() => {
    fetchChartData();
  }, []);

  const incomeChartData = {
    labels: [getTranslation("home.monthly"), getTranslation("home.yearly")],
    datasets: [
      {
        data: [incomeSummary?.monthlyTotal || 0, incomeSummary?.yearlyTotal || 0],
        color: () => theme.colors.success,
      }
    ]
  };

  const expenseChartData = {
    labels: [getTranslation("home.monthly"), getTranslation("home.yearly")],
    datasets: [
      {
        data: [paymentSummary?.monthlyPayment || 0, paymentSummary?.totalAmount || 0],
        color: () => theme.colors.error,
      }
    ]
  };

  const chartConfig = {
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    color: (opacity = 1) => activeTab === 0 ? theme.colors.success : theme.colors.error,
    labelColor: (opacity = 1) => theme.colors.text,
    barPercentage: 0.7,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
    },
    propsForVerticalLabels: {
      fontSize: 10,
    },
  };

  const renderChart = () => {
    const data = activeTab === 0 ? incomeChartData : expenseChartData;
    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - (Platform.OS === 'ios' ? 48 : 40);
    
    return (
      <BarChart
        data={data}
        width={chartWidth}
        height={220}
        chartConfig={chartConfig}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
        withInnerLines={false}
        yAxisLabel=""
        yAxisSuffix=" TL"
        segments={4}
      />
    );
  };

  const renderSummary = () => {
    const monthlyBalance = (incomeSummary?.monthlyTotal || 0) - (paymentSummary?.monthlyPayment || 0);
    const yearlyBalance = (incomeSummary?.yearlyTotal || 0) - (paymentSummary?.totalAmount || 0);
    
    return (
      <BaseView style={styles.summary}>
        <BaseView style={styles.summaryItem}>
          <BaseText variant="subtitle" weight="bold">
            {getTranslation("home.monthly")}
          </BaseText>
          <BaseView style={styles.summaryRow}>
            <BaseText variant="body" style={{ color: theme.colors.success }}>
              +{(incomeSummary?.monthlyTotal || 0).toLocaleString()}
            </BaseText>
            <BaseText variant="body" style={{ color: theme.colors.error }}>
              -{(paymentSummary?.monthlyPayment || 0).toLocaleString()}
            </BaseText>
          </BaseView>
          <BaseText 
            variant="body" 
            style={[
              styles.balanceText,
              { color: monthlyBalance >= 0 ? theme.colors.success : theme.colors.error }
            ]}
          >
            = {monthlyBalance.toLocaleString()} {getTranslation("home.currency")}
          </BaseText>
        </BaseView>
        <BaseView style={styles.summaryItem}>
          <BaseText variant="subtitle" weight="bold">
            {getTranslation("home.yearly")}
          </BaseText>
          <BaseView style={styles.summaryRow}>
            <BaseText variant="body" style={{ color: theme.colors.success }}>
              +{(incomeSummary?.yearlyTotal || 0).toLocaleString()}
            </BaseText>
            <BaseText variant="body" style={{ color: theme.colors.error }}>
              -{(paymentSummary?.totalAmount || 0).toLocaleString()}
            </BaseText>
          </BaseView>
          <BaseText 
            variant="body"
            style={[
              styles.balanceText,
              { color: yearlyBalance >= 0 ? theme.colors.success : theme.colors.error }
            ]}
          >
            = {yearlyBalance.toLocaleString()} {getTranslation("home.currency")}
          </BaseText>
        </BaseView>
      </BaseView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      margin: Platform.OS === 'ios' ? 16 : 12,
      marginBottom: 8,
      borderRadius: 12,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    title: {
      flex: 1,
      marginRight: 16,
    },
    refreshButton: {
      width: 44,
      height: 44,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 22,
    },
    tabs: {
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    chartContainer: {
      borderRadius: 8,
      padding: Platform.OS === 'ios' ? 12 : 8,
      marginHorizontal: 16,
    },
    chart: {
      marginVertical: 8,
      borderRadius: 8,
    },
    summary: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 16,
      marginHorizontal: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 8,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Platform.OS === 'ios' ? 16 : 12,
      marginTop: 4,
    },
    balanceText: {
      marginTop: 4,
      fontWeight: 'bold',
    },
  });

  return (
    <BaseView variant="card" padding="medium" style={styles.container}>
      <BaseView style={styles.header}>
        <BaseText variant="title" weight="bold" style={styles.title}>
          {getTranslation("home.income-expense-chart")}
        </BaseText>
        <BaseButton
          variant="icon"
          onPress={fetchChartData}
          loading={isLoading}
          style={styles.refreshButton}
        >
          <BaseIcon name="refresh" size={20} color={theme.colors.text} />
        </BaseButton>
      </BaseView>
      <BaseTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        style={styles.tabs}
      >
        <BaseTabItem
          label={getTranslation("home.income")}
          color={theme.colors.success}
        />
        <BaseTabItem
          label={getTranslation("home.expense")}
          color={theme.colors.error}
        />
      </BaseTabs>
      <BaseView style={[styles.chartContainer, { backgroundColor: theme.colors.card }]}>
        {renderChart()}
      </BaseView>
      {renderSummary()}
    </BaseView>
  );
}); 