import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  BaseText,
  BaseView,
  PageLayout,
  BaseDescription,
  DescriptionItemProps,
  BaseFlatList,
  AmountDisplay,
} from "@guden-components";
import { BasePage } from "@guden-hooks";
import { useThemeContext } from "@guden-theme";
import { IncomeService, PaymentService } from "@guden-services";
import { IncomeSummary, PaymentSummary, Payment } from "@guden-models";
import { ConvertDateToString, DateFormat } from "guden-core";

export function Home() {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();
  const [incomeSummary, setIncomeSummary] = useState<IncomeSummary | null>(
    null
  );
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null
  );
  const [upcomingPayments, setUpcomingPayments] = useState<Payment[]>([]);
  const { getIncomeSummary } = IncomeService();
  const { getPaymentSummary } = PaymentService();

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    try {
      const [incomeData, paymentData] = await Promise.all([
        getIncomeSummary(),
        getPaymentSummary(),
      ]);
      setIncomeSummary(incomeData);
      setPaymentSummary(paymentData);
    } catch (error) {
      console.error("Özet veriler getirilirken hata:", error);
    }
  };

  const MonthlyOverview = () => {
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
      <BaseView
        variant="card"
        padding="medium"
        style={styles.overviewContainer}
      >
        <BaseText variant="title" weight="bold" style={styles.overviewTitle}>
          {getTranslation("home.monthly-overview")}
        </BaseText>
        <BaseDescription
          items={monthlyItems as DescriptionItemProps[]}
          column={2}
        />
      </BaseView>
    );
  };

  const YearlyOverview = () => {
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
      <BaseView
        variant="card"
        padding="medium"
        style={styles.overviewContainer}
      >
        <BaseText variant="title" weight="bold" style={styles.overviewTitle}>
          {getTranslation("home.yearly-overview")}
        </BaseText>
        <BaseDescription
          items={yearlyItems as DescriptionItemProps[]}
          column={2}
        />
      </BaseView>
    );
  };

  const UpcomingPayments = () => {
    if (upcomingPayments.length === 0) {
      return (
        <BaseView
          variant="card"
          padding="medium"
          style={styles.overviewContainer}
        >
          <BaseText variant="title" weight="bold" style={styles.overviewTitle}>
            {getTranslation("home.upcoming-payments")}
          </BaseText>
          <BaseText variant="body" style={styles.noDataText}>
            {getTranslation("home.no-upcoming-payments")}
          </BaseText>
        </BaseView>
      );
    }

    return (
      <BaseView
        variant="card"
        padding="medium"
        style={styles.overviewContainer}
      ></BaseView>
    );
  };

  const styles = StyleSheet.create({
    overviewContainer: {
      margin: 16,
      marginBottom: 8,
    },
    overviewTitle: {
      marginBottom: 16,
    },
    noDataText: {
      textAlign: "center",
      opacity: 0.7,
    },
    paymentItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    paymentInfo: {
      flex: 1,
      marginRight: 16,
    },
    dueDate: {
      marginTop: 4,
      opacity: 0.7,
    },
    paymentAmount: {
      alignItems: "flex-end",
    },
    paymentList: {
      paddingTop: 8,
    },
  });

  return (
    <PageLayout title={getTranslation("home.title")} padding="none">
      <BaseView>
        <MonthlyOverview />
        <YearlyOverview />
      </BaseView>
    </PageLayout>
  );
}
