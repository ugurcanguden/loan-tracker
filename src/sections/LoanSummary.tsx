import { BaseView, BaseText } from '@guden-components';
import { useTranslation } from 'react-i18next'; 
import { useThemeContext } from '@guden-theme';

export function LoanSummary() {
  const { t } = useTranslation();
  const { theme } = useThemeContext();

  return (
    <BaseView 
      variant="card"
      padding="large"
    >
      <BaseText 
        variant="title"
        weight="bold"
        style={{ marginBottom: 15 }}
      >
        {t('loan_summary')}
      </BaseText>
      <BaseText 
        variant="body"
        style={{ marginBottom: 10 }}
      >
        {t('total_debt')}: 120,000₺
      </BaseText>
      <BaseText 
        variant="body"
      >
        {t('remaining_debt')}: 40,000₺
      </BaseText>
    </BaseView>
  );
}
