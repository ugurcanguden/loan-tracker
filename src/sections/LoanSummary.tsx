import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next'; 
import { useThemeContext } from '@guden-theme';

export function LoanSummary() {
  const { t } = useTranslation();
  const { theme } = useThemeContext();

  return (
    <View style={{ padding: 20, backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text, fontSize: 20 }}>
        {t('loan_summary')}
      </Text>
      <Text style={{ color: theme.colors.text }}>
        {t('total_debt')}: 120,000₺
      </Text>
      <Text style={{ color: theme.colors.text }}>
        {t('remaining_debt')}: 40,000₺
      </Text>
    </View>
  );
}
