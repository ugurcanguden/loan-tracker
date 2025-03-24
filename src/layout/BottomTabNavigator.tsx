import { Ionicons } from '@expo/vector-icons';
import { SettingsButton } from '@guden-components';
import { MENU_ITEMS } from '@guden-constants';
import { BasePage } from '@guden-hooks';
import { useThemeContext } from '@guden-theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { HomeScreen } from '../../app/dashboard/home';
import { IncomeScreen } from '../../app/dashboard/income';
import { PaymentsScreen } from '../../app/dashboard/payments';
import { ReportsScreen } from '../../app/dashboard/reports';
import { SettingsScreen } from '../../app/dashboard/settings';
import MenuScreen from './MenuScreen';

const Tab = createBottomTabNavigator();

const getComponent = (componentName: string) => {
  switch (componentName) {
    case 'HomeScreen':
      return HomeScreen;
    case 'PaymentsScreen':
      return PaymentsScreen;
    case 'IncomeScreen':
      return IncomeScreen;
    case 'MenuScreen':
      return MenuScreen;
    case 'SettingsScreen':
      return SettingsScreen;
    case '/settings':
      return ReportsScreen;
    default:
      return HomeScreen;
  }
};

export function BottomTabNavigator() {
  const { theme } = useThemeContext();
  const { getTranslation } = BasePage();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: theme.colors.background },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.text,
        }}
      >
        {MENU_ITEMS.map((item) => {
          const Component = getComponent(item.componentName);
          return (
            <Tab.Screen
              key={item.key}
              name={getTranslation(`menu.${item.name}`)}
              component={Component}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={size} color={color} />
                ),
              }}
            />
          );
        })}
      </Tab.Navigator>

      <SettingsButton />
    </View>
  );
}
