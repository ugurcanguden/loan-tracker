import { StyleSheet } from "react-native";
import {
  BaseText,
  BaseView,
  BaseFlatList,
  BaseButton,
  BaseIcon,
  AmountDisplay,
} from "@guden-components";
import { BasePage } from "@guden-hooks";
import { useThemeContext } from "@guden-theme";
import { UpcomingPayment } from "@guden-models";
import { PaymentService } from "@guden-services";
import { useEffect, useState } from "react";
import { ConvertDateToString, DateFormat } from "guden-core";
import { useGlobalState } from "@guden-context";

export const UpcomingPayments = () => {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  const [pastPayments, setPastPayments] = useState<UpcomingPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getUpcomingPayments } = PaymentService();
  const { refreshCount } = useGlobalState();

  const fetchUpcomingPayments = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const payments = await getUpcomingPayments();
      const currentDate = new Date();
      const upcoming = payments.filter(payment => new Date(payment.dueDate) >= currentDate);
      const past = payments.filter(payment => new Date(payment.dueDate) < currentDate);
      setUpcomingPayments(upcoming);
      setPastPayments(past);
    } catch (error) {
      console.error("Yaklaşan ödemeler getirilirken hata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingPayments();
  }, []);

  useEffect(() => {
    if (refreshCount > 0) {
      fetchUpcomingPayments();
    }
  }, [refreshCount]);

  const renderPaymentItem = ({ item }: { item: UpcomingPayment }) => (
    <BaseView style={styles.paymentItem}>
      <BaseView style={styles.paymentInfo}>
        <BaseText variant="subtitle" weight="bold">
          {item.name}
        </BaseText>
        <BaseText variant="body" style={styles.dueDate}>
          {ConvertDateToString(new Date(item.dueDate || ""), DateFormat.DDMMYYYYP)}
        </BaseText>
      </BaseView>
      <AmountDisplay amount={item.amount || 0} currency="TL" style={styles.paymentAmount} />
    </BaseView>
  );

  return (
    <BaseView variant="card" padding="medium" style={styles.container}>
      <BaseView style={styles.header}>
        <BaseView style={styles.warningContainer}>
          <BaseText style={[styles.emoji, { color: theme.colors.warning }]}>😟</BaseText>
        </BaseView>
        <BaseText variant="title" weight="bold" style={styles.title}>
          {getTranslation("home.upcoming-payments")}
        </BaseText>
        <BaseButton
          variant="icon"
          onPress={fetchUpcomingPayments}
          loading={isLoading}
          style={styles.refreshButton}
        >
          <BaseIcon name="refresh" size={20} color={theme.colors.text} />
        </BaseButton>
      </BaseView>

      {upcomingPayments.length > 0 ? (
        <BaseFlatList
          data={upcomingPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.id!.toString()}
          contentContainerStyle={styles.paymentList}
        />
      ) : (
        <BaseText variant="body" style={styles.noDataText}>
          {getTranslation("home.no-upcoming-payments")}
        </BaseText>
      )}

      {pastPayments.length > 0 && (
        <BaseView style={styles.pastPaymentsContainer}>
          <BaseText variant="title" weight="bold" style={styles.pastTitle}>
            {getTranslation("home.past-payments")}
          </BaseText>
          <BaseView style={styles.warningContainer}>
            <BaseText style={[styles.emoji, { color: theme.colors.error }]}>😢</BaseText>
          </BaseView>
          <BaseFlatList
            data={pastPayments}
            renderItem={renderPaymentItem}
            keyExtractor={(item) => item.id!.toString()}
            contentContainerStyle={styles.paymentList}
          />
        </BaseView>
      )}
    </BaseView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    flex: 1,
  },
  refreshButton: {
    marginLeft: 8,
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
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
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
  pastPaymentsContainer: {
    marginTop: 16,
  },
  pastTitle: {
    marginBottom: 8,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
  },
});
