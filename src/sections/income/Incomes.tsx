import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, Dimensions, Alert } from "react-native";
import { 
  BaseText,
  BaseView,
  BaseTouchable,
  BaseFlatList,
  BaseAlert,
  BaseModal,
  BaseDatePicker,
  AmountDisplay,
  PageLayout,
  BaseDescription,
  DescriptionItemProps,
} from "@guden-components";
import { IncomeService } from "@guden-services";
import { Income, IncomeSummary } from "@guden-models";
import { ConvertDateToString, DateFormat } from "guden-core";
import { BasePage } from "@guden-hooks";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeContext } from "@guden-theme";
import IncomeForm from "./IncomeForm"; 

const SCREEN_HEIGHT = Dimensions.get('window').height;

export  function Incomes() {
  const { theme } = useThemeContext();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [summary, setSummary] = useState<IncomeSummary | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const { getIncomes, deleteIncome, getIncomeSummary } = IncomeService();
  const { getTranslation } = BasePage();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomesData, summaryData] = await Promise.all([
        getIncomes(startDate || undefined, endDate || undefined),
        getIncomeSummary(startDate || undefined, endDate || undefined)
      ]);
      setIncomes(incomesData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Veriler getirilirken hata:', error);
      Alert.alert(getTranslation("common.error"), getTranslation("common.fetchError"));
    }
  };

  const handleDelete = async (id: number, event: any) => {
    event.stopPropagation();
    BaseAlert.confirm(
      getTranslation("common.deleteTitle"),
      getTranslation("common.deleteMessage"),
      async () => {
        try {
          await deleteIncome(id);
          fetchData();
        } catch (error) {
          console.error('Gelir silinirken hata:', error);
          Alert.alert(getTranslation("common.error"), getTranslation("common.deleteError"));
        }
      }
    );
  };

  const handleAddIncome = () => {
    setIsModalVisible(true);
  };

  const handleSaveIncome = () => {
    fetchData();
    setIsModalVisible(false);
  };

  const convertDate = (date: string) => {
    const dateFormat = new Date(date);
    return ConvertDateToString(dateFormat, DateFormat.DDMMYYYYP);
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
      onClose={() => setIsFilterModalVisible(false)}
      size="medium"
      title={getTranslation("income.filter.title")}
    >
      <BaseView style={styles.filterContainer}>
        <BaseView style={styles.filterItem}>
          <BaseText variant="label">{getTranslation("income.filter.startDate")}</BaseText>
          <BaseDatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder={getTranslation("income.filter.selectStartDate")}
          />
        </BaseView>

        <BaseView style={styles.filterItem}>
          <BaseText variant="label">{getTranslation("income.filter.endDate")}</BaseText>
          <BaseDatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder={getTranslation("income.filter.selectEndDate")}
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
            <BaseText>{getTranslation("income.filter.clear")}</BaseText>
          </BaseTouchable>

          <BaseTouchable
            variant="primary"
            size="small"
            onPress={handleApplyFilter}
            style={styles.filterButton}
          >
            <BaseText>{getTranslation("income.filter.apply")}</BaseText>
          </BaseTouchable>
        </BaseView>
      </BaseView>
    </BaseModal>
  );

  const SummarySection = () => {
    const summaryItems = [
      {
        label: getTranslation("income.monthlyTotal"),
        value: summary?.monthlyTotal || 0,
        isCurrency: true
      },
      {
        label: getTranslation("income.yearlyTotal"),
        value: summary?.yearlyTotal || 0,
        isCurrency: true
      },
      {
        label: getTranslation("income.totalAmount"),
        value: summary?.totalAmount || 0,
        isCurrency: true
      },
      {
        label: getTranslation("income.totalIncomes"),
        value: summary?.totalIncomes || 0
      }
    ];

    return (
      <BaseView variant="card" padding="medium" style={styles.summaryContainer}>
        <BaseText variant="title" weight="bold" style={styles.summaryTitle}>
          {getTranslation("income.summary")}
        </BaseText>
        <BaseDescription items={summaryItems as DescriptionItemProps[]} column={2} />
      </BaseView>
    );
  };

  const renderItem = ({ item }: { item: Income }) => (
    <BaseTouchable 
      variant="default"
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
                {convertDate(item.date)}
              </BaseText>
            </BaseView>
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
    summaryContainer: {
      margin: 16,
      marginBottom: 8,
    },
    summaryTitle: {
      marginBottom: 16,
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
      flexDirection: 'row',
      justifyContent: 'flex-end',
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
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 24,
    },
    filterButton: {
      marginLeft: 8,
    },
  });

  const dynamicStyles = StyleSheet.create({
    actionButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });

  return (
    <PageLayout 
      title={getTranslation("income.title")}
      showAddButton
      onAddPress={handleAddIncome}
      padding="none"
    >
      <BaseView style={styles.container}>
        <BaseView style={styles.headerActions}>
          <BaseTouchable
            variant="outline"
            size="small"
            style={dynamicStyles.actionButton}
            onPress={() => setIsFilterModalVisible(true)}
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
          data={incomes}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      </BaseView>

      <BaseModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        size={"large"}
        closeButtonSize={30}
        title={getTranslation("income.addTitle")}
      >
        <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
          <IncomeForm onClosed={handleSaveIncome} />
        </ScrollView>
      </BaseModal>

      <FilterModal />
    </PageLayout>
  );
} 