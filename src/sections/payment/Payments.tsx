import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AmountDisplay,
  BaseAlert,
  BaseDatePicker,
  BaseFlatList,
  BaseModal,
  BaseText,
  BaseTouchable,
  BaseView,
  BaseDescription,
  DescriptionItemProps,
  PageLayout,
} from "@guden-components";
import { BasePage } from "@guden-hooks";
import { Payment, PaymentSummary } from "@guden-models";
import { PaymentService } from "@guden-services";
import { useThemeContext } from "@guden-theme";
import { ConvertDateToString, DateFormat } from "guden-core";
import { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet } from "react-native"; 
import PaymentDetailPage from "./payment-detail/PaymentDetail";
import { PaymentForm } from "./PaymentForm";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function Payments() {
  const { theme } = useThemeContext();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { getPayments, deletePayment, getPaymentSummary } = PaymentService();
  const { getTranslation } = BasePage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const paymentsData = await getPayments(
        startDate || undefined,
        endDate || undefined
      );
      const summaryData = await getPaymentSummary(
        startDate || undefined,
        endDate || undefined
      );
      setPayments(paymentsData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Veriler getirilirken hata:", error);
      Alert.alert(
        getTranslation("common.error"),
        getTranslation("common.fetchError")
      );
    }
  };

  const handleDelete = async (id: number, event: any) => {
    event.stopPropagation();
    BaseAlert.confirm(
      getTranslation("common.deleteTitle"),
      getTranslation("common.deleteMessage"),
      async () => {
        await deletePayment(id);
        fetchData();
      }
    );
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsModalVisible(true);
  };

  const handleSavePayment = () => {
    fetchData();
    setIsModalVisible(false);
  };

  const handlePaymentPress = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalVisible(true);
  };

  const convertDate = (date: string) => {
    const dateFormat = new Date(date);
    return ConvertDateToString(dateFormat, DateFormat.DDMMYYYYP);
  };

  const getStatusColor = (payment: Payment) => {
    if (payment.isRecurring === 1) {
      return "#4BB543"; // Yeşil - Taksitli
    }
    return theme.colors.primary; // Normal renk - Tek seferlik
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    fetchData();
  };

  const handleApplyFilter = () => {
    fetchData();
    setIsFilterModalVisible(false);
  };

  const FilterModal = () => (
    <BaseModal
      visible={isFilterModalVisible}
      onClose={() => { 
        setIsFilterModalVisible(false);
      }}
      size="large"
      title={getTranslation("payment.filter.title")}
    >
      <BaseView style={styles.filterContainer}>
        <BaseView style={styles.filterItem}>
          <BaseText variant="label">
            {getTranslation("payment.filter.startDate")}
          </BaseText>
          <BaseDatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder={getTranslation("payment.filter.selectStartDate")}
          />
        </BaseView>

        <BaseView style={styles.filterItem}>
          <BaseText variant="label">
            {getTranslation("payment.filter.endDate")}
          </BaseText>
          <BaseDatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder={getTranslation("payment.filter.selectEndDate")}
            minDate={startDate || undefined}
          />
        </BaseView>

        <BaseView style={styles.filterActions}>
          <BaseTouchable
            variant="outline"
            size="small"
            onPress={handleClearFilter}
            style={styles.filterButton}
          >
            <BaseText>{getTranslation("payment.filter.clear")}</BaseText>
          </BaseTouchable>

          <BaseTouchable
            variant="primary"
            size="small"
            onPress={handleApplyFilter}
            style={styles.filterButton}
          >
            <BaseText>{getTranslation("payment.filter.apply")}</BaseText>
          </BaseTouchable>
        </BaseView>
      </BaseView>
    </BaseModal>
  );

  const renderItem = ({ item }: { item: Payment }) => (
    <BaseTouchable
      variant="default"
      onPress={() => handlePaymentPress(item)}
      style={styles.itemTouchable}
    >
      <BaseView
        variant="background"
        padding="medium"
        borderRadius={15}
        style={styles.itemContainer}
      >
        {/* Sol taraf - İsim ve Detaylar */}
        <BaseView style={styles.leftContent}>
          <BaseView style={styles.headerRow}>
            <BaseText
              variant="subtitle"
              weight="bold"
              style={[styles.title, { color: theme.colors.text }]}
            >
              {item.name}
            </BaseText>
            <MaterialCommunityIcons
              name={item.isRecurring === 1 ? "sync" : "cash"}
              size={20}
              color={getStatusColor(item)}
              style={styles.typeIcon}
            />
          </BaseView>

          <BaseView style={styles.detailsContainer}>
            <BaseView style={styles.detailRow}>
              <MaterialCommunityIcons
                name="calendar"
                size={16}
                color={theme.colors.text}
                style={styles.detailIcon}
              />
              <BaseText variant="body" style={styles.detailText}>
                {convertDate(item.startDate)}
              </BaseText>
            </BaseView>

            {item.isRecurring === 1 && (
              <BaseView style={styles.detailRow}>
                <MaterialCommunityIcons
                  name="sync"
                  size={16}
                  color={theme.colors.text}
                  style={styles.detailIcon}
                />
                <BaseText variant="body" style={styles.detailText}>
                  {`${item.installments} ${getTranslation("payment.months")}`}
                </BaseText>
              </BaseView>
            )}
          </BaseView>
        </BaseView>

        {/* Sağ taraf - Tutar ve Silme */}
        <BaseView style={styles.rightContent}>
          <AmountDisplay amount={item.amount} currency="TL" />
          <BaseTouchable
            variant="background"
            onPress={(e) => handleDelete(item.id!, e)}
            style={styles.deleteButton}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={20}
              color={theme.colors.error}
            />
          </BaseTouchable>
        </BaseView>
      </BaseView>
    </BaseTouchable>
  );

  const SummarySection = () => {
    const summaryItems = [
      {
        label: getTranslation("payment.total-amount"),
        value: summary?.totalAmount || 0,
        isCurrency: true,
      },
      {
        label: getTranslation("payment.total-paid"),
        value: summary?.totalPaid || 0,
        isCurrency: true,
      },
      {
        label: getTranslation("payment.total-remaining"),
        value: summary?.totalRemaining || 0,
        isCurrency: true,
      },
      {
        label: getTranslation("payment.monthly-payment"),
        value: summary?.monthlyPayment || 0,
        isCurrency: true,
      },
      {
        label: getTranslation("payment.total-payments"),
        value: summary?.totalPayments || 0,
      },
      {
        label: getTranslation("payment.overdue-payments"),
        value: summary?.overdueCount || 0,
        textStyle: { color: theme.colors.error },
      },
    ];

    return (
      <BaseView variant="card" padding="medium" style={styles.summaryContainer}>
        <BaseText variant="title" weight="bold" style={styles.summaryTitle}>
          {getTranslation("payment.summary")}
        </BaseText>
        <BaseDescription
          items={summaryItems as DescriptionItemProps[]}
          column={2}
        />
      </BaseView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    list: {
      flex: 1,
    },
    listContainer: {
      padding: 16,
      paddingBottom: 80,
    },
    modalScroll: {
      maxHeight: SCREEN_HEIGHT * 0.85,
    },
    modalContent: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    itemTouchable: {
      marginBottom: 12,
    },
    itemContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    leftContent: {
      flex: 1,
      marginRight: 16,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      marginRight: 8,
    },
    typeIcon: {
      marginLeft: 4,
    },
    detailsContainer: {
      marginTop: 4,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    detailIcon: {
      marginRight: 6,
      opacity: 0.7,
    },
    detailText: {
      fontSize: 14,
      opacity: 0.8,
    },
    rightContent: {
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    deleteButton: {
      marginTop: 8,
      padding: 6,
    },
    headerActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      gap: 8,
      paddingHorizontal: 16,
      paddingTop: 8,
    },
    filterContainer: {
      padding: 16,
    },
    filterItem: {
      marginBottom: 16,
    },
    filterActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 24,
    },
    filterButton: {
      marginLeft: 8,
    },
    summaryContainer: {
      margin: 16,
      marginBottom: 8,
    },
    summaryTitle: {
      marginBottom: 16,
    },
    summaryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -8,
    },
    summaryItem: {
      width: "50%",
      padding: 8,
    },
  });

  const dynamicStyles = StyleSheet.create({
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  return (
    <PageLayout
      title={getTranslation("payment.title")}
      showAddButton
      onAddPress={handleAddPayment}
      padding="none"
    >
      <BaseView style={styles.container}>
        <BaseView style={styles.headerActions}>
          <BaseTouchable
            variant="outline"
            size="small"
            style={dynamicStyles.actionButton}
            onPress={() => {
              setIsFilterModalVisible(true);
              setIsModalVisible(false);
            }}
          >
            <MaterialCommunityIcons
              name="filter-outline"
              size={24}
              color={theme.colors.primary}
            />
          </BaseTouchable>

          <BaseTouchable
            variant="outline"
            size="small"
            style={dynamicStyles.actionButton}
            onPress={fetchData}
          >
            <MaterialCommunityIcons
              name="refresh"
              size={24}
              color={theme.colors.primary}
            />
          </BaseTouchable>
        </BaseView>

        <SummarySection />

        <BaseFlatList
          data={payments}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      </BaseView>

      <BaseModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          fetchData();
        }}
        size={"large"}
        closeButtonSize={30}
        title={
          selectedPayment
            ? getTranslation("payment.detailTitle")
            : getTranslation("payment.addTitle")
        }
      >
        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalContent}
        >
          {selectedPayment ? (
            <PaymentDetailPage payment={selectedPayment} />
          ) : (
            <PaymentForm onClosed={handleSavePayment} />
          )}
        </ScrollView>
      </BaseModal>

      <FilterModal />
    </PageLayout>
  );
}
