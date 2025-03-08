import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Dimensions } from "react-native";
import {
  AmountDisplay,
  BaseText,
  BaseView,
  BaseTouchable,
  BaseFlatList,
  BaseAlert,
  BaseModal,
} from "@guden-components";
import { PaymentService } from "@guden-services";
import { Payment } from "@guden-models";
import { ConvertDateToString, DateFormat } from "guden-core";
import { BasePage } from "@guden-hooks";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeContext } from "@guden-theme";
import PaymentForm from "./PaymentForm";
import { PaymentDetailPage } from "./PaymentDetail";
import { PageLayout } from "../../components/layout/PageLayout";

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Payments() {
  const { theme } = useThemeContext();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { getPayments, deletePayment } = PaymentService();
  const { getTranslation } = BasePage();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const data = await getPayments();
    setPayments(data);
  };

  const handleDelete = async (id: number, event: any) => {
    event.stopPropagation();
    BaseAlert.confirm(
      getTranslation("common.deleteTitle"),
      getTranslation("common.deleteMessage"),
      async () => {
        await deletePayment(id);
        fetchPayments();
      }
    );
  };

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsModalVisible(true);
  };

  const handleSavePayment = () => {
    fetchPayments();
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
          <AmountDisplay 
            amount={item.amount} 
            currency="TL"
          />
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

  return (
    <PageLayout 
      title={getTranslation("payment.title")}
      showAddButton
      onAddPress={handleAddPayment}
      padding="none"
    >
      <BaseFlatList
        data={payments}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        style={styles.list}
      />
      <BaseModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        size={"large"}
        closeButtonSize={30}
        title={selectedPayment 
          ? getTranslation("payment.detailTitle")
          : getTranslation("payment.addTitle")
        }
      >
        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
          {selectedPayment ? (
            <PaymentDetailPage payment={selectedPayment} />
          ) : (
            <PaymentForm onClosed={handleSavePayment} />
          )}
        </ScrollView>
      </BaseModal>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
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
}); 