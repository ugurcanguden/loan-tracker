import { BaseView, PageLayout, BaseButton, BaseIcon } from "@guden-components";
import { BasePage } from "@guden-hooks";
import { MonthlyOverview, MonthlyOverviewRef } from "./MonthlyOverview";
import { YearlyOverview, YearlyOverviewRef } from "./YearlyOverview";
import { UpcomingPayments, UpcomingPaymentsRef } from "./UpcomingPayments";
import { ChartOverview, ChartOverviewRef } from "./ChartOverview";
import { useThemeContext } from "@guden-theme";
import { useRef, useState } from "react";

export function Home() {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const monthlyRef = useRef<MonthlyOverviewRef>(null);
  const yearlyRef = useRef<YearlyOverviewRef>(null);
  const upcomingRef = useRef<UpcomingPaymentsRef>(null);
  const chartRef = useRef<ChartOverviewRef>(null);

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await Promise.all([
        monthlyRef.current?.fetchSummaryData(),
        yearlyRef.current?.fetchSummaryData(),
        upcomingRef.current?.fetchUpcomingPayments(),
        chartRef.current?.fetchChartData(),
      ]);
    } catch (error) {
      console.error("Veriler yenilenirken hata:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <PageLayout 
      title={getTranslation("home.title")} 
      padding="none" 
    >
      <BaseView>
        <MonthlyOverview ref={monthlyRef} />
        <YearlyOverview ref={yearlyRef} />
        <ChartOverview ref={chartRef} />
        <UpcomingPayments ref={upcomingRef} />
      </BaseView>
    </PageLayout>
  );
}
