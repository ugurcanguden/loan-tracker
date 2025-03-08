import { Ionicons } from '@expo/vector-icons';
import { SettingsButton } from '@guden-components';
import { MENU_ITEMS } from '@guden-constants';
import { BasePage } from '@guden-hooks';
import { useThemeContext } from '@guden-theme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { SafeAreaView, ViewProps } from 'react-native';
import { HomeScreen } from '../../app/dashboard/home';
import { IncomeScreen } from '../../app/dashboard/income';
import { PaymentsScreen } from '../../app/dashboard/payments';
import { ReportsScreen } from '../../app/dashboard/reports';
import { SettingsScreen } from '../../app/dashboard/settings';
import MenuScreen from './MenuScreen';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
    const [renderCount, setRenderCount] = useState(0);
    const { theme } = useThemeContext();
    const { getTranslation } = BasePage();
    const getComponent = (componentName: string) => {
        switch (componentName) {
            case 'HomeScreen':
                return HomeScreen;
            case 'PaymentsScreen':
                return PaymentsScreen;
            case 'IncomeScreen':
                return IncomeScreen;
            case 'MenuScreen':
                return () => <MenuScreen />;
            case 'SettingsScreen':
                return SettingsScreen;
            case '/settings':
                return ReportsScreen;
            default:
                return HomeScreen;
        }
    };

    const viewProps: ViewProps = {
        style: { flex: 1 }
    };

    const tabNavigatorProps = {
        screenOptions: {
            headerShown: false,
            tabBarStyle: { backgroundColor: theme.colors.background },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.text,
        }
    };

    const tabScreenProps = (item: any) => ({
        key: item.key,
        name: getTranslation(`menu.${item.name}`),
        component: getComponent(item.componentName),
        options: {
            tabBarIcon: ({ color, size }: any) => <Ionicons name={item.icon} size={size} color={color} />,
        },
        listeners: {
            tabPress: () => setRenderCount(renderCount + 1),
        }
    });

    return (
        <SafeAreaView  {...viewProps}>
            <Tab.Navigator {...tabNavigatorProps}>
                {MENU_ITEMS.map((item: any) => (
                    <Tab.Screen {...tabScreenProps(item)} />
                ))}
            </Tab.Navigator>
            <SettingsButton />
        </SafeAreaView>
    );
}