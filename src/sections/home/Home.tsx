import { BaseButton, BaseTouchable, BaseView, PageLayout } from "@guden-components";
import { useGlobalState } from "@guden-context";
import { BasePage } from "@guden-hooks";
import { ChartOverview } from "./components/ChartOverview";
import { MonthlyOverview } from "./components/MonthlyOverview";
import { UpcomingPayments } from "./components/UpcomingPayments";
import { YearlyOverview } from "./components/YearlyOverview";
import { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export function Home() {
  const { getTranslation,theme } = BasePage();
  const { refreshCount, setRefreshCount } = useGlobalState();
  useEffect(() => {
    setRefreshCount(0);
  }, []);
  const handleRefresh = () => {
    setRefreshCount(refreshCount + 1);
  };

  return (
    <PageLayout
      title={getTranslation("home.title")}  
      rightComponent={
        <BaseTouchable
          variant="outline"
          size="small" 
          onPress={handleRefresh}
        >
          <MaterialCommunityIcons
            name="refresh"
            size={24}
            color={theme.colors.primary}
          />
        </BaseTouchable>
      }
    >
      <BaseView>
        <MonthlyOverview />
        <YearlyOverview />
        <ChartOverview />
        <UpcomingPayments />
      </BaseView>
    </PageLayout>
  );
}
