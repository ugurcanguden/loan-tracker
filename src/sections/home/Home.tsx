import { BaseView, PageLayout } from "@guden-components";
import { BasePage } from "@guden-hooks";
import { MonthlyOverview } from "./MonthlyOverview";
import { YearlyOverview } from "./YearlyOverview";

export function Home() {
  const { getTranslation } = BasePage();

  return (
    <PageLayout title={getTranslation("home.title")} padding="none">
      <BaseView>
        <MonthlyOverview />
        <YearlyOverview />
      </BaseView>
    </PageLayout>
  );
}
